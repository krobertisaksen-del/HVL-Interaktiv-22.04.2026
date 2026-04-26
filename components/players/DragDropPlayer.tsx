import React, { useState, useRef, useMemo, useEffect } from 'react';
import { CheckCircle2, X, ChevronRight, Upload, AlertCircle } from 'lucide-react';
import { CompletionScreen } from '../ui/CompletionScreen';
import { PlayerProps, DragItem, DragZone } from '../../types';

const SafeImage = ({ src, alt, className, style, draggable = true }: { src: string; alt?: string; className?: string; style?: React.CSSProperties, draggable?: boolean }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`${className} bg-slate-100 flex flex-col items-center justify-center p-2 text-center border-2 border-dashed border-red-300 text-red-800 text-[10px] overflow-hidden`} style={style}>
        <div className="opacity-50 mb-1"><AlertCircle size={16} /></div>
        <span className="font-bold leading-none">Blokkert</span>
      </div>
    );
  }
  return <img src={src} alt={alt || "Bilde"} className={className} style={style} onError={() => setError(true)} draggable={draggable} />;
};

export const DragDropPlayer: React.FC<PlayerProps> = ({ data, onSuccess }) => {
  const tasks = useMemo(() => data.tasks || [], [data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hasContinued, setHasContinued] = useState(false);
  
  const [items, setItems] = useState<DragItem[]>([]);
  const [activeDrag, setActiveDrag] = useState<{id: number | string, offsetX: number, offsetY: number, startX?: number, startY?: number} | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTask = tasks[currentIndex];

  useEffect(() => {
    if (currentTask) {
        setItems(currentTask.items ? currentTask.items.map((i: DragItem) => ({ ...i, x: null, y: null })) : []);
        setFeedback(null);
        setShowResults(false);
    }
  }, [currentTask]);

  const startDragFromBench = (e: React.MouseEvent | React.TouchEvent, item: DragItem) => {
      // Prevent mapping to touch if we want standard behavior, but for custom touch drag we do this:
      // However for touch we shouldn't preventDefault unconditionally depending on what we want, but it's safe here mostly.
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      if (!containerRef.current) return;
      const itemRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const offsetX = clientX - itemRect.left;
      const offsetY = clientY - itemRect.top;
      
      setActiveDrag({ id: item.id, offsetX, offsetY, startX: clientX, startY: clientY });
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, id: any) => {
    if(showResults) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    setActiveDrag({ id, offsetX, offsetY, startX: clientX, startY: clientY });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!activeDrag || !containerRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (activeDrag.startX !== undefined && activeDrag.startY !== undefined) {
      const dist = Math.abs(clientX - activeDrag.startX) + Math.abs(clientY - activeDrag.startY);
      if (dist < 8) return; // Prevent accidental drag on tap
    }

    if ('touches' in e) {
      // Prevent scrolling while dragging
      e.preventDefault();
    }
    
    const containerRect = containerRef.current.getBoundingClientRect();
    let x = ((clientX - containerRect.left - activeDrag.offsetX) / containerRect.width) * 100;
    let y = ((clientY - containerRect.top - activeDrag.offsetY) / containerRect.height) * 100;
    setItems(prev => prev.map(i => i.id === activeDrag.id ? { ...i, x, y } : i));
  };

  const handlePointerUp = () => {
    setActiveDrag(null);
  };

  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
      if (selectedItem && containerRef.current) {
          // If we have a selected item and click the container, drop it there
          const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
          const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
          
          const containerRect = containerRef.current.getBoundingClientRect();
          let itemWidth = 80;
          let itemHeight = 40; // Default guesses
          
          const el = document.getElementById(`drag-item-${selectedItem}`);
          if (el) {
              const rect = el.getBoundingClientRect();
              itemWidth = el.classList.contains('absolute') ? rect.width : (rect.width * 1.2); // Rough adjustment since board items usually scale up
              itemHeight = el.classList.contains('absolute') ? rect.height : (rect.height * 1.2);
          }
          
          const pixelX = clientX - containerRect.left - (itemWidth / 2);
          const pixelY = clientY - containerRect.top - (itemHeight / 2);

          const x = (pixelX / containerRect.width) * 100;
          const y = (pixelY / containerRect.height) * 100;
          
          setItems(prev => prev.map(i => i.id === selectedItem ? { ...i, x, y } : i));
          setSelectedItem(null);
      }
  };

  const checkAnswer = () => {
    let correctCount = 0;
    const results = items.map(item => {
        if (!item.correctZoneId) return { ...item, isCorrect: true };
        if (item.x === null) return { ...item, isCorrect: false };
        const zone = currentTask.zones.find((z: DragZone) => z.id == item.correctZoneId);
        if (!zone) return { ...item, isCorrect: false };
        const cx = item.x + 5; 
        const cy = item.y + 2.5;
        const inZone = cx >= zone.left && cx <= (zone.left + (zone.width || 15)) && cy >= zone.top && cy <= (zone.top + (zone.height || 10));
        if(inZone) correctCount++;
        return { ...item, isCorrect: inZone };
    });
    
    setItems(results);
    setShowResults(true);
    const requiredCount = items.filter(i => i.correctZoneId).length;
    
    if (correctCount === requiredCount) {
        setFeedback({ type: 'success', msg: 'Fantastisk! Alt er riktig plassert.' });
    } else {
        setFeedback({ type: 'error', msg: `Du har plassert ${correctCount} av ${requiredCount} elementer riktig.` });
    }
  };

  const next = () => {
      if (currentIndex < tasks.length - 1) {
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
      if (!onSuccess) return <CompletionScreen onRestart={() => { setFinished(false); setCurrentIndex(0); }} message="Alle oppgaver fullført!" />;
      return <div className="text-center animate-in fade-in pt-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
        </div>
        <p className="text-green-600 font-bold mt-4 flex items-center justify-center gap-2">Fullført! Du kan nå gå videre.</p>
      </div>;
  }

  if(!currentTask) return <div>Laster oppgave...</div>;

  return (
    <div className="space-y-6 select-none" onMouseMove={handlePointerMove} onTouchMove={handlePointerMove} onMouseUp={handlePointerUp} onTouchEnd={handlePointerUp}>
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h4 className="font-bold text-slate-700">Oppgave {currentIndex + 1} av {tasks.length}</h4>
          <button onClick={() => { setItems(currentTask.items.map((i: DragItem) => ({...i, x: null, y: null}))); setFeedback(null); setShowResults(false); setSelectedItem(null); }} className="text-sm text-slate-500 hover:text-cyan-700 underline focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none rounded min-h-[32px] min-w-[32px] px-2 py-1">Nullstill</button>
      </div>
      
      <div ref={containerRef} onClick={handleContainerClick} className={`relative border-2 ${selectedItem ? 'border-cyan-400 cursor-crosshair ring-4 ring-cyan-100' : 'border-slate-200'} rounded-2xl bg-slate-100 min-h-[500px] shadow-inner transition-all delay-75`}>
        {selectedItem && <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-cyan-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse pointer-events-none">Klikk her for å plassere elementet</div>}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <SafeImage src={currentTask.backgroundUrl} alt={currentTask.altText || "Bakgrunn"} className="w-full h-full object-cover opacity-90 block pointer-events-none" draggable={false} />
            {(currentTask.zones || []).map((z: DragZone) => (
                <div key={z.id} style={{ top: `${z.top}%`, left: `${z.left}%`, width: `${z.width || 15}%`, height: `${z.height || 10}%` }} className="absolute border-2 border-dashed border-slate-500/30 bg-white/20 rounded-lg flex items-center justify-center group">
                    <span className="text-[10px] font-bold text-slate-600 uppercase bg-white/80 px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{z.label}</span>
                </div>
            ))}
        </div>
        {items.filter(i => i.x !== null).map(i => (
            <div 
                key={i.id} 
                id={`drag-item-${i.id}`}
                onMouseDown={(e) => handlePointerDown(e, i.id)} 
                onTouchStart={(e) => handlePointerDown(e, i.id)}
                onClick={(e) => { e.stopPropagation(); setSelectedItem(selectedItem === i.id ? null : i.id); }}
                style={{ top: `${i.y}%`, left: `${i.x}%`, position: 'absolute', zIndex: (activeDrag?.id === i.id || selectedItem === i.id) ? 50 : 10, touchAction: 'none' }} 
                className={`cursor-grab active:cursor-grabbing shadow-lg transition-transform transform hover:scale-105 ${showResults ? (i.isCorrect ? 'ring-4 ring-green-500' : 'ring-4 ring-red-500') : (selectedItem === i.id ? 'ring-4 ring-cyan-500 scale-105' : '')} rounded-lg`}
                aria-label={`Dra element: ${i.content}`}
                tabIndex={0}
                onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedItem(selectedItem === i.id ? null : i.id); } }}
            >
                {i.type === 'image' ? <SafeImage src={i.content} alt="Element" className="w-24 h-24 object-cover rounded-lg border-2 border-white bg-white" draggable={false}/> : <div className={`bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-md ${selectedItem === i.id ? 'border-2 border-white' : 'border border-cyan-800'}`}>{i.content}</div>}
                {showResults && (
                    <div className={`absolute -top-2 -right-2 rounded-full p-1 text-white ${i.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {i.isCorrect ? <CheckCircle2 size={12}/> : <X size={12}/>}
                    </div>
                )}
            </div>
        ))}
      </div>
      
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 min-h-[120px] flex gap-4 flex-wrap items-center justify-center">
         {items.filter(i => i.x === null).length === 0 && <span className="text-slate-400 text-sm italic">Alle elementer er plassert</span>}
         {items.filter(i => i.x === null).map(i => (
             <div 
                 key={i.id} 
                 id={`drag-item-${i.id}`}
                 onMouseDown={(e) => startDragFromBench(e, i)} 
                 onTouchStart={(e) => startDragFromBench(e, i)} 
                 onClick={(e) => { e.stopPropagation(); setSelectedItem(selectedItem === i.id ? null : i.id); }}
                 style={{ touchAction: 'none' }}
                 className={`cursor-grab shadow-sm transition-transform ${selectedItem === i.id ? 'scale-110 ring-4 ring-cyan-500 rounded-lg' : 'hover:scale-105'}`} 
                 aria-label={`Dra eller velg element: ${i.content}`}
                 tabIndex={0}
                 onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedItem(selectedItem === i.id ? null : i.id); } }}
             >
                {i.type === 'image' ? <SafeImage src={i.content} alt="Element" className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200 bg-white" draggable={false}/> : <div className="bg-white border-2 border-cyan-100 text-cyan-800 px-4 py-2 rounded-lg text-sm font-bold hover:border-cyan-300 transition-all">{i.content}</div>}
             </div>
         ))}
      </div>
      
      <div className="flex justify-center items-center pt-4">
         {feedback && <div className={`mr-6 font-bold text-lg animate-in fade-in slide-in-from-bottom-2 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.msg}</div>}
         {!showResults ? (
            <button onClick={checkAnswer} className="px-8 py-3 bg-cyan-700 text-white rounded-xl hover:bg-cyan-800 font-bold shadow-lg shadow-cyan-100 transition-transform active:scale-95">Sjekk Svar</button>
         ) : (
            feedback.type === 'success' && (
                <button onClick={next} className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-bold shadow-lg flex items-center gap-2">
                    {currentIndex < tasks.length - 1 ? 'Neste Oppgave' : 'Fullfør'} <ChevronRight size={20}/>
                </button>
            )
         )}
      </div>
    </div>
  );
};