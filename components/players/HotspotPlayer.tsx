
import React, { useState, useMemo, useEffect } from 'react';
import { X, CircleCheck, Plus, ChevronRight, Lock, CircleAlert, Loader2 } from 'lucide-react';
import { CompletionScreen } from '../ui/CompletionScreen';
import { PlayerProps, Hotspot } from '../../types';

const SafeImage = ({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  if (error) {
    return (
      <div className={`${className} bg-slate-100 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-red-300 text-red-800 text-xs overflow-hidden`} style={style}>
        <div className="mb-2 opacity-50"><CircleAlert size={24} /></div>
        <span className="font-bold">Bilde blokkert eller utilgjengelig</span>
        <span className="opacity-70 mt-1 text-[10px] leading-tight max-w-[200px]">
           Canvas eller nettleseren blokkerer bildet. Prøv å laste det opp direkte eller bruk en annen URL.
        </span>
      </div>
    );
  }
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-10">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      )}
      <img 
        src={src} 
        alt={alt || "Interaktivt bilde"} 
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100 transition-opacity'}`} 
        style={style} 
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }} 
      />
    </div>
  );
};

export const HotspotPlayer: React.FC<PlayerProps> = ({ data, onSuccess }) => {
  const scenes = useMemo(() => {
    if (data.scenes && data.scenes.length > 0) return data.scenes;
    return [];
  }, [data]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSpot, setActiveSpot] = useState<number | string | null>(null);
  const [viewedSpots, setViewedSpots] = useState<(number | string)[]>([]); 
  const [finished, setFinished] = useState(false);
  const [hasContinued, setHasContinued] = useState(false);

  const currentScene = scenes[currentIndex];
  const isSceneFinished = useMemo(() => {
    if (!currentScene || !currentScene.hotspots) return true;
    return currentScene.hotspots.every((h: Hotspot) => viewedSpots.includes(h.id));
  }, [currentScene, viewedSpots]);

  useEffect(() => {
      setViewedSpots([]);
      setActiveSpot(null);
  }, [currentIndex]);

  const handleSpotClick = (id: number | string) => {
      setActiveSpot(activeSpot === id ? null : id);
      if (!viewedSpots.includes(id)) {
          setViewedSpots(prev => [...prev, id]);
      }
  };

  const next = () => {
      if (currentIndex < scenes.length - 1) {
          setCurrentIndex(prev => prev + 1);
      } else {
          setFinished(true);
      }
  };
  
  useEffect(() => {
      if (finished && onSuccess && !hasContinued) {
          setHasContinued(true);
          onSuccess({});
      }
  }, [finished, onSuccess, hasContinued]);

  if (finished) {
      if(!onSuccess) return <CompletionScreen onRestart={() => { setFinished(false); setCurrentIndex(0); }} />;
      return <div className="text-center animate-in fade-in pt-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CircleCheck size={32} />
        </div>
        <p className="text-green-600 font-bold mt-4 flex items-center justify-center gap-2">Fullført! Du kan nå gå videre.</p>
      </div>;
  }

  if (!currentScene) return <div className="p-12 text-center text-slate-400">Ingen bilder funnet i denne aktiviteten.</div>;

  return (
    <article className="space-y-8">
        <header className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h4 className="font-bold text-slate-700">Utforsk bildet ({currentIndex + 1} av {scenes.length})</h4>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500" role="status" aria-live="polite">
              {viewedSpots.length} av {(currentScene.hotspots||[]).length} funnet
            </span>
        </header>
        
        <div className="relative inline-block w-full h-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group">
            {currentScene.imageUrl ? (
                <SafeImage src={currentScene.imageUrl} alt={currentScene.altText || "Interaktivt Bilde"} className="w-full h-auto block opacity-95 group-hover:opacity-100 transition-opacity" />
            ) : (
                <div className="h-64 flex items-center justify-center text-slate-500 bg-slate-800">
                  <div className="text-center">
                    <CircleAlert size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Bilde mangler eller er ikke lastet opp.</p>
                  </div>
                </div>
            )}
            
            {(currentScene.hotspots || []).map((hs: Hotspot) => (
                <React.Fragment key={hs.id}>
                <button 
                    onClick={() => handleSpotClick(hs.id)} 
                    style={{ top: `${hs.top}%`, left: `${hs.left}%` }} 
                    className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-110 z-10 cursor-pointer ${viewedSpots.includes(hs.id) ? 'bg-green-500 text-white' : 'bg-cyan-600 text-white animate-pulse'} ring-4 ring-white/30`}
                    aria-label={`Hotspot: ${hs.header}`}
                    aria-expanded={activeSpot === hs.id}
                >
                    {activeSpot === hs.id ? <X size={20} aria-hidden="true" /> : (viewedSpots.includes(hs.id) ? <CircleCheck size={20} aria-hidden="true" /> : <Plus size={24} strokeWidth={3} aria-hidden="true" />)}
                </button>
                
                {activeSpot === hs.id && (
                    <section 
                      style={{ top: `${Math.min(hs.top + 8, 80)}%`, left: `${Math.min(Math.max(hs.left - 15, 5), 65)}%` }} 
                      className="absolute w-72 bg-white p-6 rounded-2xl shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200 origin-top-left border-l-8 border-cyan-600"
                    >
                        <h5 className="font-bold text-lg text-slate-800 mb-2">{hs.header}</h5>
                        <p className="text-slate-600 leading-relaxed">{hs.content}</p>
                    </section>
                )}
                </React.Fragment>
            ))}
            {activeSpot && (<div className="absolute inset-0 z-20 bg-black/10" onClick={() => setActiveSpot(null)} aria-hidden="true" />)}
        </div>

        <footer className="flex justify-end pt-4">
            {isSceneFinished ? (
                <button 
                  onClick={() => {
                    if (currentIndex === scenes.length - 1) {
                        if (onSuccess) onSuccess({});
                        else setFinished(true);
                    } else {
                        next();
                    }
                }} className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                    {currentIndex < scenes.length - 1 ? 'Neste bilde' : 'Fullfør'} <ChevronRight size={20} aria-hidden="true"/>
                </button>
            ) : (
                <span className="text-sm text-slate-400 font-medium italic flex items-center gap-2" role="status">
                  <Lock size={14} aria-hidden="true"/> Finn alle punktene for å gå videre
                </span>
            )}
        </footer>
    </article>
  );
};
