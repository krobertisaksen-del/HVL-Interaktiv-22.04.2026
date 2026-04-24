
import React, { useState, useEffect } from 'react';
import { Hexagon, Layout, BookOpen, Loader2, CircleAlert, PlayCircle, Wrench, RefreshCw, ArrowLeft, CircleCheck, Eye, Moon, Sun } from 'lucide-react';
import { Activity } from './types';
import { getDefaultData } from './constants';
import { Dashboard } from './components/Dashboard';
import { HelpPage } from './components/HelpPage';
import { Editor } from './components/Editor';
import { Player } from './components/Player';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function HVLInteraktivApp() {
  const [view, setView] = useState<'dashboard' | 'editor' | 'player' | 'help'>('dashboard');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  
  // App State
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  

  // --- INITIAL LOAD ---
  const init = async () => {
    try {
      setLoading(true);
      // 1. Get User Info (and LTI Launch Context)
      const userRes = await fetch('/api/me');
      
      if (userRes.status === 401) {
           throw new Error("LTI_AUTH_FAILED");
      }
      
      if (!userRes.ok) {
          throw new Error(`Kunne ikkje kople til serveren (Status: ${userRes.status})`);
      }
      
      const userData = await userRes.json();
      setUser(userData);
      
      if (userData.authMethod === 'test') {
          setIsTestMode(true);
      }

      // 2. Get Activities for this Course
      const actRes = await fetch('/api/activities');
      if (!actRes.ok) throw new Error("Kunne ikke laste aktiviteter.");
      const actData = await actRes.json();
      setActivities(actData);

      // 3. Handle Auto-Launch (Student clicked a specific activity)
      if (userData.activityId) {
          const target = actData.find((a: Activity) => a.id === userData.activityId);
          if (target) {
              setCurrentActivity(target);
              setView('player');
          }
      }
      
    } catch (err: any) {
      console.error(err);
      
      // CHECK: Are we running locally? (Dev mode or built locally)
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isDev = (import.meta as any).env?.DEV;

      if (isDev || isLocal) {
          console.warn("API failed, falling back to localStorage (DEV/LOCAL MODE)");
          enableTestMode();
      } else {
          setError(err.message === "LTI_AUTH_FAILED" ? "LTI_AUTH_FAILED" : err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  // Listen for Feide Login Success
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        init();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const enableTestMode = () => {
      const saved = localStorage.getItem('hvl_activities');
      if (saved) {
          try {
            setActivities(JSON.parse(saved));
          } catch(e) {
            setActivities([]);
          }
      }
      setUser({ name: 'Testbrukar', roles: ['Instructor'] });
      setIsTestMode(true);
      setError(null);
  };

  const handleFeideLogin = async () => {
    try {
      const res = await fetch('/api/auth/feide');
      if (!res.ok) throw new Error("Kunne ikke hente påloggings-URL");
      const { url } = await res.json();
      
      const authWindow = window.open(url, 'feide_popup', 'width=600,height=700');
      if (!authWindow) {
        alert("Popup blokkert. Ver venleg og tillat pop-ups for denne nettsida.");
      }
    } catch (err) {
      console.error(err);
      alert("Feil ved pålogging.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      setUser(null);
      setActivities([]);
      setError("LTI_AUTH_FAILED");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFullActivity = async (activity: Activity): Promise<Activity> => {
      if (isTestMode || activity.data) return activity;
      try {
          setLoading(true);
          const res = await fetch(`/api/activities/${activity.id}`);
          if (!res.ok) throw new Error("Feil ved lasting av data");
          return await res.json();
      } catch (err) {
          console.error(err);
          alert("Kunne ikkje laste oppgåve-data.");
          return activity;
      } finally {
          setLoading(false);
      }
  };

  const handleDeepLinkSelect = async (activity: Activity) => {
    try {
        setLoading(true);
        // Post the selection to backend, which returns an auto-submitting HTML form
        const res = await fetch('/api/deeplink', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: activity.id, title: activity.title })
        });
        
        if (!res.ok) throw new Error("Kunne ikke opprette kobling.");
        
        const formHtml = await res.text();
        // Replace current document with the auto-submitting form to return to Canvas
        document.body.innerHTML = formHtml;
        // Execute the script in the form if it doesn't auto-run (ltijs forms usually auto-submit)
        const forms = document.getElementsByTagName('form');
        if(forms.length > 0) forms[0].submit();

    } catch (e) {
        console.error(e);
        alert("Feil ved valg av aktivitet.");
        setLoading(false);
    }
  };

  const handleCreate = (type: string) => {
    // We create a temporary object, but don't save to DB until "Save" is clicked in Editor
    const newActivity: Activity = {
      id: 'temp-' + Date.now(),
      type,
      title: '',
      description: '',
      data: getDefaultData(type),
      createdAt: new Date().toISOString()
    };
    setCurrentActivity(newActivity);
    setView('editor');
  };

  const handleSave = async (updatedActivity: Activity) => {
    // TEST MODE
    if (isTestMode) {
        const isNew = updatedActivity.id.startsWith('temp-');
        let savedActivity = { ...updatedActivity };
        if (isNew) savedActivity.id = 'test-' + Date.now();
        
        setActivities(prev => {
            const newActivities = isNew ? [savedActivity, ...prev] : prev.map(a => a.id === savedActivity.id ? savedActivity : a);
            localStorage.setItem('hvl_activities', JSON.stringify(newActivities));
            return newActivities;
        });
        setCurrentActivity(savedActivity);
        return;
    }

    try {
        let saved: Activity;
        const isNew = updatedActivity.id.startsWith('temp-');

        if (isNew) {
            // Create
            const res = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: updatedActivity.type,
                    title: updatedActivity.title,
                    description: updatedActivity.description,
                    data: updatedActivity.data
                })
            });
            if (!res.ok) throw new Error("Feil ved lagring");
            saved = await res.json();
        } else {
            // Update
            const res = await fetch(`/api/activities/${updatedActivity.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: updatedActivity.title,
                    description: updatedActivity.description,
                    data: updatedActivity.data
                })
            });
            if (!res.ok) throw new Error("Feil ved oppdatering");
            saved = await res.json();
        }

        setActivities(prev => {
          if (isNew) return [saved, ...prev];
          return prev.map(a => a.id === saved.id ? saved : a);
        });
        setCurrentActivity(saved);
    } catch (e) {
        console.error(e);
        alert("Kunne ikkje lagre aktiviteten. Sjekk internett-tilkoplinga.");
    }
  };

  const handleDelete = async (id: string) => {
    if (isTestMode) {
        setActivities(prev => {
            const newActivities = prev.filter(a => a.id !== id);
            localStorage.setItem('hvl_activities', JSON.stringify(newActivities));
            return newActivities;
        });
        return;
    }
    try {
        await fetch(`/api/activities/${id}`, { method: 'DELETE' });
        setActivities(prev => prev.filter(a => a.id !== id));
    } catch (e) {
        alert("Feil ved sletting.");
    }
  };

  const handleDuplicate = async (activity: Activity) => {
    if (isTestMode) {
         const newActivity = { ...activity, id: 'test-' + Date.now(), title: `${activity.title} (Kopi)` };
         setActivities(prev => {
             const newActivities = [newActivity, ...prev];
             localStorage.setItem('hvl_activities', JSON.stringify(newActivities));
             return newActivities;
         });
         return;
    }
    try {
        const res = await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: activity.type,
                title: `${activity.title} (Kopi)`,
                description: activity.description,
                data: activity.data
            })
        });
        const saved = await res.json();
        setActivities(prev => [saved, ...prev]);
    } catch (e) {
        alert("Kunne ikke duplisere.");
    }
  };

  const handleExport = async () => {
    let toExport = activities;
    if (!isTestMode) {
        if (!confirm("Advarsel: Dette vil laste ned alle oppgåver og store mediefiler. Er du sikker?")) return;
        try {
            setLoading(true);
            toExport = await Promise.all(activities.map(a => fetchFullActivity(a)));
        } catch (e) {
            alert("Feil ved eksportering.");
            setLoading(false);
            return;
        } finally {
            setLoading(false);
        }
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(toExport));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "hvl_aktiviteter_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if(typeof e.target?.result === 'string') {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
              if (isTestMode) {
                  setActivities(prev => {
                      const merged = [...imported, ...prev];
                      localStorage.setItem('hvl_activities', JSON.stringify(merged));
                      return merged;
                  });
                  alert(`Importerte ${imported.length} aktivitetar (Lokalt).`);
                  return;
              }
              let count = 0;
              for (const item of imported) {
                  await fetch('/api/activities', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({
                          type: item.type,
                          title: item.title,
                          description: item.description,
                          data: item.data
                      })
                  });
                  count++;
              }
              const actRes = await fetch('/api/activities');
              const actData = await actRes.json();
              setActivities(actData);
              alert(`Importerte ${count} aktivitetar til databasen.`);
          }
        }
      } catch (error) {
        console.error(error);
        alert("Kunne ikke lese filen.");
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={48} className="animate-spin mb-4 text-cyan-600"/>
              <p>Laster inn HVL Interaktiv...</p>
          </div>
      );
  }

  // --- ERROR SCREEN ---
  if (error) {
    const isAuthError = error === "LTI_AUTH_FAILED";
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-xl text-center border border-slate-200">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isAuthError ? 'bg-cyan-100 text-cyan-700' : 'bg-red-100 text-red-600'}`}>
            {isAuthError ? <Hexagon size={40}/> : <CircleAlert size={40}/>}
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {isAuthError ? "HVL Interaktiv" : "Feil ved tilkobling"}
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {isAuthError 
              ? "Denne applikasjonen krever pålogging. Vennligst start den fra Canvas eller logg inn med Feide." 
              : `Systemmelding: ${error}`}
          </p>

          {isAuthError ? (
            <div className="space-y-4">
              <button 
                onClick={handleFeideLogin}
                className="w-full flex items-center justify-center gap-3 bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-cyan-700/20 text-lg"
              >
                <PlayCircle className="w-6 h-6" />
                Logg inn med Feide
              </button>
            </div>
          ) : (
            <button onClick={() => window.location.reload()} className="mb-8 px-8 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-colors flex items-center gap-2 mx-auto">
               <RefreshCw size={20}/> Prøv igjen
            </button>
          )}

          <div className="border-t border-slate-100 pt-8 mt-8 w-full">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Er du utviklar eller testar?</p>
            <button 
              onClick={enableTestMode}
              className="w-full px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-cyan-300 hover:text-cyan-700 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Wrench size={18} /> Åpne Test-modus (Lokal lagring)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-cyan-100">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-5 cursor-default bg-transparent border-0 p-0 text-left">
          <div className="w-16 h-16 bg-cyan-700 rounded-2xl flex items-center justify-center shadow-cyan-200 shadow-lg" aria-hidden="true">
            <Hexagon className="text-white w-10 h-10" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-4xl tracking-tight text-slate-800 leading-none">HVL Interaktiv</h1>
            <p className="text-lg text-cyan-700 font-bold uppercase tracking-widest mt-1">Høgskulen på Vestlandet</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {isTestMode && (
               <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold text-sm border border-amber-200 flex items-center gap-2">
                   <CircleAlert size={16}/> Test-modus
               </div>
           )}
           {user?.isDeepLinking && (
               <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-sm border border-blue-200 flex items-center gap-2 animate-pulse">
                   <CircleCheck size={16}/> Val-modus (Legg til i Canvas)
               </div>
           )}
           <nav className="flex gap-3">

            {view !== 'dashboard' && (
                <button onClick={() => setView('dashboard')} className="px-6 py-4 text-slate-600 hover:bg-slate-100 hover:text-cyan-700 rounded-xl text-lg font-bold transition-all flex items-center gap-2 hover:-translate-y-1 hover:shadow-sm">
                <Layout size={24} aria-hidden="true"/> Hovudmeny
                </button>
            )}
            {view !== 'help' && (
                <button onClick={() => setView('help')} className="px-6 py-4 rounded-xl text-lg font-bold transition-all flex items-center gap-2 hover:-translate-y-1 hover:shadow-sm bg-green-50/50 text-slate-600 border border-green-100 hover:bg-green-50 hover:text-green-700 hover:border-green-200 shadow-sm">
                    <BookOpen size={24} aria-hidden="true"/> Pedagogisk bruk
                </button>
            )}
            {user?.authMethod === 'feide' && (
              <button onClick={handleLogout} className="px-6 py-4 bg-white text-red-600 border border-red-100 hover:bg-red-50 rounded-xl text-lg font-bold transition-colors flex items-center gap-2">
                Logg ut
              </button>
            )}
           </nav>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-8 md:p-12">
        <ErrorBoundary key={view} componentName={view === 'dashboard' ? 'Dashbord' : view === 'editor' ? 'Redigering' : view === 'player' ? 'Aktivitet' : 'Hjelp'}>
          {view === 'dashboard' && (
            <Dashboard 
              activities={activities} 
              onCreate={handleCreate} 
              onEdit={async (a) => { const full = await fetchFullActivity(a); setCurrentActivity(full); setView('editor'); }} 
              onPlay={async (a) => { const full = await fetchFullActivity(a); setCurrentActivity(full); setView('player'); }} 
              onDelete={handleDelete}
              onDuplicate={async (a) => { const full = await fetchFullActivity(a); handleDuplicate(full); }}
              onExport={handleExport}
              onImport={handleImport}
              isDeepLinking={user?.isDeepLinking}
              onSelect={async (a) => { const full = await fetchFullActivity(a); handleDeepLinkSelect(full); }}
            />
          )}
          {view === 'help' && <HelpPage />}
          {view === 'editor' && currentActivity && <Editor activity={currentActivity} onSave={handleSave} onPreview={() => setView('player')} onClose={() => setView('dashboard')} />}
          {view === 'player' && currentActivity && (
            <div>
              {user?.activityId && (
                 <div className="mb-6">
                   <button onClick={() => { window.location.href = '/'; /* Reload to get out of single activity mode if needed */ }} className="flex items-center gap-2 text-slate-500 hover:text-cyan-700 font-bold">
                      <ArrowLeft size={20}/> Tilbake til alle aktivitetar
                   </button>
                 </div>
              )}
              <Player activity={currentActivity} onEdit={() => setView('editor')} />
            </div>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
