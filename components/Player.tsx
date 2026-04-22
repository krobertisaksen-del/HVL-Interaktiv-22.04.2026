import React, { useState } from 'react';
import { Hexagon, Pencil, Play, ArrowRight } from 'lucide-react';
import { Activity } from '../types';
import { MCPlayer } from './players/MCPlayer';
import { TFPlayer } from './players/TFPlayer';
import { ClozePlayer } from './players/ClozePlayer';
import { HotspotPlayer } from './players/HotspotPlayer';
import { VideoPlayer } from './players/VideoPlayer';
import { TimelinePlayer } from './players/TimelinePlayer';
import { DragDropPlayer } from './players/DragDropPlayer';
import { MemoryPlayer } from './players/MemoryPlayer';
import { MixedPlayer } from './players/MixedPlayer';

interface PlayerProps {
  activity: Activity;
  onEdit: () => void;
}

export const Player: React.FC<PlayerProps> = ({ activity, onEdit }) => {
  const [started, setStarted] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const handleSuccess = async (result: any) => {
    if (scoreSubmitted) return; // Prevent multiple submissions
    
    // Result payload usually has { score, total }
    const scoreGiven = result?.score !== undefined ? result.score : 100;
    const scoreMaximum = result?.total !== undefined ? result.total : 100;

    try {
      setScoreSubmitted(true);
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scoreGiven, scoreMaximum })
      });
      const data = await res.json();
      if (data.success && data.response) {
         console.log('✅ Score submitted to Canvas automatically!');
      }
    } catch (err) {
      console.error('Failed to submit score:', err);
      // We don't block the user, it just silently fails if they aren't in a graded LTI launch
    }
  };

  const renderActivity = (type: string, data: any) => {
    switch (type) {
        case 'Flervalg': return <MCPlayer data={data} onSuccess={handleSuccess} />;
        case 'Sant/Usant': return <TFPlayer data={data} onSuccess={handleSuccess} />;
        case 'Fyll inn': return <ClozePlayer data={data} onSuccess={handleSuccess} />;
        case 'Bilde Hotspot': return <HotspotPlayer data={data} onSuccess={handleSuccess} />;
        case 'Interaktiv Video': return <VideoPlayer data={data} onSuccess={handleSuccess} />;
        case 'Tidslinje': return <TimelinePlayer data={data} onSuccess={handleSuccess} />;
        case 'Dra og Slipp': return <DragDropPlayer data={data} onSuccess={handleSuccess} />;
        case 'Minnespel': return <MemoryPlayer data={data} onSuccess={handleSuccess} />;
        case 'Fleire saman': return <MixedPlayer data={data} onSuccess={handleSuccess} />;
        default: return <div>Ukjend aktivitet</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500 pb-12">
      <main className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <header className="bg-slate-800 text-white p-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden gap-4">
          <div className="absolute top-0 right-0 opacity-5 transform translate-x-10 -translate-y-10 pointer-events-none" aria-hidden="true">
             <Hexagon size={200} fill="currentColor" stroke="none"/>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{activity.title || 'Aktivitet uten navn'}</h2>
            {activity.description && <p className="text-slate-300 text-sm max-w-xl leading-relaxed opacity-90">{activity.description}</p>}
            {!activity.description && <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">{activity.type}</p>}
          </div>
          <button onClick={onEdit} className="relative z-10 text-xs font-bold bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Pencil size={14}/> Rediger
          </button>
        </header>
        <div className="p-8 min-h-[400px] flex flex-col items-center justify-center bg-slate-50/50">
           {!started ? (
             <div className="text-center max-w-md">
               <h3 className="text-2xl font-bold text-slate-800 mb-3">Klar til å starte?</h3>
               <p className="text-slate-500 mb-8">Klikk på knappen under for å begynne aktiviteten.</p>
               <button onClick={() => setStarted(true)} className="px-10 py-4 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-lg rounded-full shadow-xl shadow-cyan-200/50 transition-transform active:scale-95 hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2 mx-auto animate-[bounce_3s_infinite]">
                 Start Aktivitet <ArrowRight size={20}/>
               </button>
             </div>
           ) : (
             <div className="w-full animate-in fade-in duration-500">
               {renderActivity(activity.type, activity.data)}
             </div>
           )}
        </div>
      </main>
    </div>
  );
};