<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Interaktiv Læringsapp (LTI 1.3 Verktøy)

Dette prosjektet er en interaktiv læringsapplikasjon utviklet for å rulle ut læringsressurser direkte i moderne LMS-er via LTI 1.3-standarden (Learning Tools Interoperability). Dokumentasjonen under er myntet på systemadministratorer, IT-avdelingen og utviklere for å forenkle oppsett og utrulling.

## Overordnet Arkitektur
Applikasjonen kjører på en Node.js-backend med Express og bruker `ltijs`-biblioteket for LTI 1.3 kommunikasjon. Typiske utrullinger krever:
1. **Node.js-miljø:** v18 eller nyere.
2. **Database:** Standardoppsettet benytter SQLite lokalt, men produksjonsmiljøer bør konfigureres mot PostgreSQL eller MySQL.
3. **Filserver/Lagring:** Mediefiler, videoer og opplastinger lagres til en lokal `uploads/`-mappe (persistent volume nødvendig i containeriserte miljøer).

---

## 🛠 For IT & Drift: Oppsett for Produksjon

### 1. Klargjøring og Installasjon
For å bygge og starte serveren i et produksjonsmiljø:
```bash
# 1. Klon prosjektet
git clone <repo-url>
cd <project-folder>

# 2. Installer avhengigheter
npm install

# 3. Bygg React-klienten (Vite)
npm run build

# 4. Start serveren
node server.js # Bruk Node direkte, eventuelt pm2 (f.eks pm2 start server.js), unngå npm start i produksjon
```
*Merk at produksjonsserveren bør kjøres bak en reverse proxy (f.eks. Nginx eller Traefik) som håndterer HTTPS og SSL-sertifikater.*

### 2. Miljøvariabler (Environment Variables)
For lokal utvikling kan du kopiere malen `.env.example` til `.env`. 
**Sikkerhetsrutine for Produksjon (State-of-the-art):** Unngå statiske `.env`-filer på serveren. Passord, `LTI_KEY` og `DATABASE_URL` bør injiseres direkte i driftssystemet fra kjøretidsmiljøet (f.eks. via Docker Compose, Kubernetes Secrets, GitHub Actions, eller skyleverandørens miljøvariabel-grensesnitt). De viktigste produksjonsvariablene er:

- `LTI_KEY`: En lang, hemmelig streng brukt til å signere cookies/sessions.
- `APP_URL`: Den offentlige root-URL-en for serveren din (f.eks. `https://verktøy.mininstitusjon.no`). **Viktig at denne starter med https://**.
- `DATABASE_URL`: Tilkoblingsstreng til database, evt `DB_HOST`, `DB_NAME`, `DB_USER` mm.

### 3. Fysisk Lagring & Konfigurasjon (Sky-arkitektur)
Applikasjonen støtter både lokal fillagring direkte på disk og opplasting til S3-kompatibel skylagring (AWS S3, MinIO, Google Cloud Storage) for en tilstandsløs og horisontalt skalerbar arkitektur.
**For produksjon:** Angi miljøvariablene `S3_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID` og `AWS_SECRET_ACCESS_KEY`, og opplastede filer vil automatisk lagres i skyen i stedet for på det lokale filsystemet. Dersom s3-variablene ikke finnes faller systemet automatisk tilbake på den lokale `/uploads`-mappen (anbefalt for lokal utvikling).

---

## 📱 Mobilstøtte & Brukeropplevelse
Aktivitetene og spiller-komponentene i applikasjonen er designet responsivt for å fungere sømløst på tvers av enheter (PC, nettbrett og mobil). Interaktive elementer, inkludert avanserte oppgavetyper som "Dra og Slipp" (Drag and Drop) støtter nå berøringsskjerm (touch-hendelser), slik at studentene kan løse oppgaver optimalt uansett plattform.

## ♿ Tilgjengelighet & WCAG 2.2
For å sikre at læringsressursene kan brukes av alle studenter har vi lagt stor vekt på universell utforming og løsninger i tråd med [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Blant de mest sentrale implementeringene:

- **1.4.11 / 2.4.13 Focus Appearance (Fokus synlighet):** Alle interaktive elementer har fått sterke, universelle fokusmarkører (cyan ringstruktur og avstand/offset) ved tastaturnavigasjon (Tab), slik at synshemmede og tastaturbrukere alltid ser hvor de er på siden.
- **2.4.11 Focus Not Obscured (Fokus tildekkes ikke):** Rammeverket benytter nå solid scrolling-padding for å garantere at fokusert innhold aldri skjuler seg under flytende headere eller paneler, men alltid ruller automatisk sentrert inn i bildet.
- **2.5.7 Dragging Movements (Dra- og slipp-bevegelser):** Vi har eliminert eksklusjonsbarrieren på "Dra og Slipp"-oppgaver. Istedenfor å kreve nøyaktige musebevegelser eller berøring over lange avstander, drar oppgaven nå utelukkende fordel av et "Klikk-for-å-velge + Klikk-for-å-plassere"-alternativ. Dette lar studenter løse krevende dra/slipp dynamikk med enkle klikk eller via Space/Enter på tastaturet.
- **2.5.8 Target Size (Minimumsstørrelse på treffpunkt):** Kritiske knapper (slik som slett, navigasjon og sortering) har robuste hitbox-størrelser (minimum for bredde og høyde utvidet), sammen med generøse buffere som sikrer nøyaktighet og forhindrer feilklikk – spesielt viktig for skjermer og personer med motoriske utfordringer.

## 🎓 Oppsett for LMS (eksempelvis Canvas med Deep Linking)

Når applikasjonen kjører på en offentlig og sikker URL (HTTPS), er den klar til å kobles til LMS via LTI 1.3. Slik setter du den opp i **Canvas**:

### Trinn 1: Opprett Developer Key i Canvas
1. Gå til **Admin -> Developer Keys -> + Developer Key -> + LTI Key**.
2. Sett **Method** til *Manual Entry* (eller lim inn LTI-JSON dersom du genererer dette via API).
3. **Title:** Navnet på verktøyet.
4. **Description:** Læringsapp.
5. **Target Link URI:** `[APP_URL]` *(f.eks. https://verktøy.mininstitusjon.no)*
6. **OpenID Connect Initiation Url:** `[APP_URL]/login`
7. **JWK Method:** Velg *Public JWK URL*.
8. **Public JWK URL:** `[APP_URL]/keys`
9. **Redirect URIs:** Sørg for å inkludere `[APP_URL]` (evt. flere callback-URIer hvis krevet av nettverket).

### Trinn 2: Plassering i Canvas (Placements for Deep Linking)
Denne appen bruker *Deep Linking* for at læreren skal velge spesifikke aktiviteter fra et bibliotek, for så å legge dem inn som oppgaver/innhold i emnet.
I oppsettet av LTI Key må du velge hvor verktøyet skal dukke opp for lærerne. De vanligste plasseringene for Deep Linking er:
- **Link Selection:** For å la appen velges når læreren legger til LTI-innhold i en emnemodul.
- **Assignment Selection:** For at aktivitetene effektivt skal kunne pares mot vurderingsboka i Canvas.
- `Editor Button`: For å legge til direkte i eksisterende ritch-text editors.
(Course Navigation brukes normalt ikke til oppgaveutvalg, siden Deep Linking krever en retur-operasjon).

### Trinn 3: Registrer plattformen i selve serveren
Serveren (applikasjonen) må godkjenne LMS-plattformen din. Dette gjøres (typisk scriptet eller programmert inn i `server.js` med `lti.registerPlatform()` metoden - justert for deres instans.
Informasjonen appen da trenger fra Canvas er:
- Canvas Issuer (`https://canvas.instructure.com`)
- LTI 1.3 Authorization URL (`https://<canvas-url>/api/lti/authorize_redirect`)
- LTI 1.3 Access Token URL (`https://<canvas-url>/login/oauth2/token`)
- LTI 1.3 JWK Set URL (`https://<canvas-url>/api/lti/security/jwks`)
- Siden Canvas er plattformen: **Client ID**, som genereres når Developer Key opprettes!

### Trinn 4: Rull ut verktøy
Etter at developer-key er lagret, *skru den "På"*. Kopier deretter Client ID og legg verktøyet til på Institusjon/Avdeling/Emnenivå under **Settings -> Apps -> View App Configurations -> + App** og velg "By Client ID".

---

## 🛡️ Sikkerhet & Skalering
- **Bruk HTTPS:** LTI 1.3 baserer seg sterkt på `Secure` og `SameSite=None` cookies over iFrames. Applikasjonen *vil ikke fungere* under oppstart inni LMS-et hvis plattform og app ikke kjøres over verifisert HTTPS.
- **Base64 -> S3/Disk:** Ulike mediefiler som laster inn går nå til en standard mappestruktur på disk. Tjenesten kan lett tilpasses en distribusjonsflyt for AWS S3 eller Google Storage via en multer-storage driver dersom dere skal oppskalere for tung videobruk på tvers av tusenvis av emner.  
- **CORS og Nginx (Content-Security-Policy):** Kontroller at proxy/Nginx tillater innbygging i iframes via Content-Security-Policy (X-Frame-Options er utdatert/ignorert i moderne nettlesere). Sett headeren slik: `Content-Security-Policy: frame-ancestors 'self' https://*.canvas.instructure.com https://canvas.instructure.com;` (Bytt ut med deres/kundenes LMS-domener). Appen legger i tillegg ved en standard CSP header.
