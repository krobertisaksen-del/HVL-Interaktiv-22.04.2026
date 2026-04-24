import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ltijs from 'ltijs';
import Database from 'ltijs-sequelize';
import { DataTypes } from 'sequelize';
import { Issuer, custom } from 'openid-client';
import session from 'express-session';
import multer from 'multer';
import express from 'express';
import ConnectSessionSequelize from 'connect-session-sequelize';
import { createServer as createViteServer } from 'vite';

const SequelizeStore = ConnectSessionSequelize(session.Store);

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let viteInstance; // Global to allow access in routes

// 0. SAFETY CHECK
// Default to Test Mode if no DB_HOST is provided, unless TEST_MODE is explicitly 'false'
const isTestMode = process.env.TEST_MODE === 'true' || (process.env.TEST_MODE !== 'false' && !process.env.DB_HOST);
const requiredEnv = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'LTI_KEY'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0 && !isTestMode) {
  console.error('❌ CRITICAL ERROR: Missing environment variables in .env file:');
  console.error(`   ${missingEnv.join(', ')}`);
  console.error('   Please copy .env.example to .env and fill in your details.');
  process.exit(1);
}

if (isTestMode) {
  console.log('🛠️ RUNNING IN TEST MODE: Strict environment checks bypassed.');
}

// 1. SETUP DATABASE CONNECTION (MariaDB/MySQL)
let dbPlugin;
let sequelize;
let Activity;

if (isTestMode && !process.env.DB_HOST) {
  console.log('🛠️ Using Mock Database for Test Mode');
  // Mock dbPlugin for ltijs
  dbPlugin = {
    setup: async () => true,
    get: async () => false,
    insert: async () => true,
    modify: async () => true,
    delete: async () => true,
    encrypt: async (data) => data,
    decrypt: async (data) => data,
    Close: async () => true
  };
  
  // Mock Sequelize-like Activity model
  const mockActivities = [];
  Activity = {
    findAll: async () => mockActivities,
    findOne: async ({ where }) => mockActivities.find(a => a.id === where.id),
    create: async (data) => {
      const newAct = { ...data, id: 'mock-' + Date.now(), createdAt: new Date(), updatedAt: new Date() };
      mockActivities.push(newAct);
      return newAct;
    },
    destroy: async ({ where }) => {
      const index = mockActivities.findIndex(a => a.id === where.id);
      if (index > -1) {
        mockActivities.splice(index, 1);
        return 1;
      }
      return 0;
    },
    sync: async () => true
  };
  
  // Mock sequelize object for session store
  sequelize = {
    define: () => Activity,
    sync: async () => true
  };
} else {
  dbPlugin = new Database(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT || 3306,
      logging: false
    }
  );
  sequelize = dbPlugin.sequelize;

  Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    contextId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false
    }
  });
}

// 2. CONFIGURE LTI PROVIDER
const ltiKey = process.env.LTI_KEY || (isTestMode ? 'test-lti-key-12345' : undefined);

if (!ltiKey && !isTestMode) {
  console.error('❌ LTI_KEY is missing and TEST_MODE is not active.');
  process.exit(1);
}

console.log('🛠️ Initializing LTI Provider...');
const lti = ltijs.Provider;
lti.setup(ltiKey || 'test-key',
  { 
    plugin: dbPlugin 
  },
  {
    staticPath: process.env.NODE_ENV === 'production' ? path.join(__dirname, 'dist') : __dirname,
    cookies: {
      secure: true,
      sameSite: 'None'
    }
  }
);

// Øk grensen for opplasting via LTIJS/Express for Data URIs
lti.app.use(express.json({ limit: '100mb' }));
lti.app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- SESSION SETUP FOR FEIDE ---
let sessionStore;
if (isTestMode && !process.env.DB_HOST) {
  console.log('🛠️ Using Mock Session Store for Test Mode');
  sessionStore = {
    sync: async () => true,
    on: () => {},
    emit: () => {}
  };
} else {
  sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'Sessions'
  });
}

// Add Session Middleware to lti.app
if (!isTestMode) {
  lti.app.use(session({
    name: 'feide-session',
    secret: process.env.LTI_KEY || 'feide-secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
}

sessionStore.sync();

// --- FEIDE OIDC SETUP ---
let feideClient;
const setupFeide = async () => {
  if (!process.env.FEIDE_CLIENT_ID || !process.env.FEIDE_CLIENT_SECRET) {
    console.warn('⚠️ Feide OIDC not configured. FEIDE_CLIENT_ID or FEIDE_CLIENT_SECRET missing.');
    return;
  }

  try {
    const feideIssuer = await Issuer.discover('https://auth.feide.no');
    feideClient = new feideIssuer.Client({
      client_id: process.env.FEIDE_CLIENT_ID,
      client_secret: process.env.FEIDE_CLIENT_SECRET,
      redirect_uris: [`${process.env.APP_URL || 'http://localhost:3000'}/api/auth/feide/callback`],
      response_types: ['code'],
    });
    console.log('✅ Feide OIDC configured');
  } catch (err) {
    console.error('❌ Failed to configure Feide OIDC:', err.message);
  }
};
setupFeide();

// CRITICAL FOR PRODUCTION: Trust the reverse proxy (Load Balancer)
lti.app.enable('trust proxy');

// 3. DEFINE ROUTES

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit overall, client side enforces 50mb video / 5mb img
});

lti.app.use('/uploads', express.static(uploadDir));

lti.app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    return res.json({ url: `/uploads/${req.file.filename}` });
  } catch(error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'File upload failed' });
  }
});

// Health Check
lti.app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok', uptime: process.uptime(), testMode: isTestMode });
});

// --- FEIDE AUTH ROUTES ---
lti.app.get('/api/auth/feide', (req, res) => {
  if (!feideClient) return res.status(500).json({ error: 'Feide not configured' });
  
  const authorizationUrl = feideClient.authorizationUrl({
    scope: 'openid profile email userid-feide',
  });
  res.json({ url: authorizationUrl });
});

lti.app.get('/api/auth/feide/callback', async (req, res) => {
  if (!feideClient) return res.status(500).send('Feide not configured');

  try {
    const params = feideClient.callbackParams(req);
    const tokenSet = await feideClient.callback(
      `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/feide/callback`,
      params
    );
    const userinfo = await feideClient.userinfo(tokenSet);

    // Store user in session
    req.session.user = {
      name: userinfo.name,
      email: userinfo.email,
      feideId: userinfo['https://n.feide.no/claims/userid_feide'] || userinfo.sub,
      roles: ['Student'], // Default role for Feide users
      contextId: 'feide-personal-' + (userinfo['https://n.feide.no/claims/userid_feide'] || userinfo.sub)
    };

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Innlogging vellykket. Dette vinduet lukkes automatisk.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Feide callback error:', err);
    res.status(500).send('Authentication failed');
  }
});

lti.app.get('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// LTI Launch (Standard)
lti.onConnect(async (token, req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production' && viteInstance) {
      let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      html = await viteInstance.transformIndexHtml(req.originalUrl, html);
      return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    }

    const distPath = path.join(__dirname, 'dist', 'index.html');
    const rootPath = path.join(__dirname, 'index.html');

    if (fs.existsSync(distPath)) {
      return res.sendFile(distPath);
    }
    return res.sendFile(rootPath);
  } catch (err) {
    console.error('Error in onConnect:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// LTI Deep Linking Launch (Teacher selecting content)
lti.onDeepLinking(async (token, req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production' && viteInstance) {
      let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      html = await viteInstance.transformIndexHtml(req.originalUrl, html);
      return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    }

    const distPath = path.join(__dirname, 'dist', 'index.html');
    const rootPath = path.join(__dirname, 'index.html');

    if (fs.existsSync(distPath)) {
      return res.sendFile(distPath);
    }
    return res.sendFile(rootPath);
  } catch (err) {
    console.error('Error in onDeepLinking:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Root Route (Graceful Fallback)
lti.app.get('/', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production' && viteInstance) {
      let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      html = await viteInstance.transformIndexHtml(req.originalUrl, html);
      return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    }

    const distPath = path.join(__dirname, 'dist', 'index.html');
    const rootPath = path.join(__dirname, 'index.html');

    if (fs.existsSync(distPath)) {
      return res.sendFile(distPath);
    }
    
    if (fs.existsSync(rootPath)) {
      return res.sendFile(rootPath);
    }
    
    return res.status(404).send('index.html not found');
  } catch (err) {
    console.error('Error in root route:', err);
    next(err);
  }
});

// User Info Route - Now includes LTI Context
lti.app.get('/api/me', async (req, res) => {
  try {
    // 0. Test Mode Mock User
    if (isTestMode && !res.locals.token && (!req.session || !req.session.user)) {
      return res.json({
        name: 'Testbruker (UI Utvikling)',
        email: 'test@hvl.no',
        roles: ['Instructor'],
        contextId: 'test-course-123',
        authMethod: 'test'
      });
    }

    // 1. Check for LTI Token
    const token = res.locals.token;
    if (token) {
      const isDeepLinking = token.platformContext.messageType === 'LtiDeepLinkingRequest';
      const activityId = req.query.activityId || token.platformContext.custom?.activityId;

      return res.json({
        name: token.userInfo.name,
        email: token.userInfo.email,
        roles: token.platformContext.roles,
        contextId: token.platformContext.context.id,
        isDeepLinking,
        activityId,
        authMethod: 'lti'
      });
    }

    // 2. Check for Feide Session
    if (req.session && req.session.user) {
      return res.json({
        ...req.session.user,
        authMethod: 'feide'
      });
    }

    return res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// --- DEEP LINKING API ---
lti.app.post('/api/deeplink', async (req, res) => {
  try {
    const token = res.locals.token;
    const { id, title } = req.body;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // Construct the Deep Linking Response
    // We create a "LTI Resource Link" that points back to this tool with ?activityId=...
    const resource = {
      type: 'ltiResourceLink',
      title: title,
      url: `${process.env.LTI_URL || ('https://' + req.get('host'))}/?activityId=${id}`, 
      custom: {
        activityId: id 
      }
    };

    const form = await lti.DeepLinking.createDeepLinkingForm(token, [resource], { message: 'Aktivitet lagt til i Canvas' });
    return res.send(form);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Deep linking failed' });
  }
});

// --- SCORING API ---
lti.app.post('/api/score', async (req, res) => {
  try {
    const token = res.locals.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    // We only want to submit grades for students actually taking a grading-enabled assignment
    if (!token.platformContext.endpoint || !token.platformContext.endpoint.lineitem) {
      return res.json({ success: true, message: 'No gradebook column found for this launch. Ignoring score.' });
    }

    const { scoreGiven, scoreMaximum } = req.body;

    const gradeObj = {
      scoreGiven: Number(scoreGiven),
      scoreMaximum: Number(scoreMaximum),
      activityProgress: 'Completed',
      gradingProgress: 'FullyGraded'
    };

    const response = await lti.Grade.SubmitScore(token, undefined, gradeObj);
    return res.json({ success: true, response });
  } catch (err) {
    console.error('Scoring error:', err);
    return res.status(500).json({ error: 'Failed to submit score to LMS' });
  }
});

// --- ACTIVITY API ROUTES ---

// GET: List all activities for the current course (Context)
lti.app.get('/api/activities', async (req, res) => {
  try {
    const token = res.locals.token;
    const feideUser = req.session?.user;

    if (!token && !feideUser && !isTestMode) return res.status(401).json({ error: 'Unauthorized' });

    const contextId = token ? token.platformContext.context.id : (feideUser ? feideUser.contextId : 'test-context');
    
    const activities = await Activity.findAll({
      where: { contextId },
      order: [['updatedAt', 'DESC']],
      attributes: { exclude: ['data'] }
    });
    
    return res.json(activities);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET: Fetch a single activity WITH data
lti.app.get('/api/activities/:id', async (req, res) => {
  try {
    const token = res.locals.token;
    const feideUser = req.session?.user;

    if (!token && !feideUser && !isTestMode) return res.status(401).json({ error: 'Unauthorized' });

    const contextId = token ? token.platformContext.context.id : (feideUser ? feideUser.contextId : 'test-context');
    const { id } = req.params;
    
    const activity = await Activity.findOne({
      where: { id, contextId }
    });
    
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    
    return res.json(activity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// POST: Create a new activity
lti.app.post('/api/activities', async (req, res) => {
  try {
    const token = res.locals.token;
    const feideUser = req.session?.user;

    if (!token && !feideUser && !isTestMode) return res.status(401).json({ error: 'Unauthorized' });

    const contextId = token ? token.platformContext.context.id : (feideUser ? feideUser.contextId : 'test-context');
    const { type, title, description, data } = req.body;

    const newActivity = await Activity.create({
      contextId,
      type,
      title,
      description,
      data
    });

    return res.json(newActivity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create activity' });
  }
});

// PUT: Update an activity
lti.app.put('/api/activities/:id', async (req, res) => {
  try {
    const token = res.locals.token;
    const feideUser = req.session?.user;

    if (!token && !feideUser && !isTestMode) return res.status(401).json({ error: 'Unauthorized' });

    const contextId = token ? token.platformContext.context.id : (feideUser ? feideUser.contextId : 'test-context');
    const { id } = req.params;
    const { title, description, data } = req.body;

    const activity = await Activity.findOne({ where: { id, contextId } });
    
    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    if (isTestMode) {
      activity.title = title;
      activity.description = description;
      activity.data = data;
      activity.updatedAt = new Date();
    } else {
      activity.title = title;
      activity.description = description;
      activity.data = data;
      await activity.save();
    }

    return res.json(activity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update activity' });
  }
});

// DELETE: Delete an activity
lti.app.delete('/api/activities/:id', async (req, res) => {
  try {
    const token = res.locals.token;
    const feideUser = req.session?.user;

    if (!token && !feideUser && !isTestMode) return res.status(401).json({ error: 'Unauthorized' });

    const contextId = token ? token.platformContext.context.id : (feideUser ? feideUser.contextId : 'test-context');
    const { id } = req.params;

    const deleted = await Activity.destroy({ where: { id, contextId } });
    
    if (!deleted) return res.status(404).json({ error: 'Activity not found' });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete activity' });
  }
});


// 4. START SERVER
const setup = async () => {
  console.log('🚀 Starting setup sequence...');
  try {
    let viteMiddlewareLayer;
    // Vite middleware for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('📦 Setting up Vite middleware...');
      viteInstance = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      lti.app.use(viteInstance.middlewares);
      viteMiddlewareLayer = lti.app._router.stack[lti.app._router.stack.length - 1];
    }

    console.log('🌐 Deploying LTI engine...');
    
    await lti.deploy({ port: 3000 });
    
    // --- BYPASS LTI AUTH IN TEST MODE ---
    // Move API, health, and root routes to the front so they run before ltijs auth
    if (isTestMode && lti.app._router && lti.app._router.stack) {
      const stack = lti.app._router.stack;
      const routesToMove = [];
      for (let i = stack.length - 1; i >= 0; i--) {
        const layer = stack[i];
        // Move our custom routes AND Vite middleware to the front
        if (layer === viteMiddlewareLayer || (layer.route && layer.route.path && 
           (layer.route.path.startsWith('/api/') || layer.route.path === '/health' || layer.route.path === '/'))) {
          routesToMove.push(stack.splice(i, 1)[0]);
        }
      }
      // Insert after query (0) and expressInit (1)
      stack.splice(2, 0, ...routesToMove.reverse());
      console.log(`🚀 Moved ${routesToMove.length} layers to the front for Test Mode`);
    }
    
    // Sync Database Models (Create tables if they don't exist)
    console.log('💾 Syncing database models...');
    await sequelize.sync(); 
    console.log('✅ Database synced');

    if (process.env.PLATFORM_URL && process.env.CLIENT_ID) {
      try {
        const platform = await lti.registerPlatform({
          url: process.env.PLATFORM_URL,
          name: 'Canvas',
          clientId: process.env.CLIENT_ID,
          authenticationEndpoint: process.env.AUTH_LOGIN_URL,
          accesstokenEndpoint: process.env.AUTH_TOKEN_URL,
          authConfig: { method: 'JWK_SET', key: process.env.KEY_SET_URL }
        });
        console.log('✅ Platform registered automatically:', await platform.platformName());
      } catch (e) {
        if (!e.message.includes('Platform already registered')) {
            console.warn('⚠️ Platform registration notice:', e.message);
        }
      }
    }
    
    console.log('🚀 LTI Server listening on port 3000');
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

setup();