
import React from 'react';
import { 
  CircleCheck, CircleHelp, Type, MapPin, Video, CalendarClock, 
  MousePointer2, Grid, Layers, Plus, Layout, Play, Pencil, Copy 
} from 'lucide-react';
import { Activity } from '../types';
import { DeleteButton } from './ui/DeleteButton';

interface DashboardProps {
  activities: Activity[];
  onCreate: (type: string) => void;
  onEdit: (activity: Activity) => void;
  onPlay: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onDuplicate: (activity: Activity) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDeepLinking?: boolean;
  onSelect?: (activity: Activity) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ activities, onCreate, onEdit, onPlay, onDelete, onDuplicate, onExport, onImport, isDeepLinking = false, onSelect }) => {
  const types = [
    { label: 'Fleirval', icon: CircleCheck, color: 'bg-cyan-600' },
    { label: 'Sant/usant', icon: CircleHelp, color: 'bg-teal-600' },
    { label: 'Dra og slepp', icon: MousePointer2, color: 'bg-amber-600' },
    { label: 'Tidslinje', icon: CalendarClock, color: 'bg-indigo-600' },
    { label: 'Bilete-hotspot', icon: MapPin, color: 'bg-rose-500' },
    { label: 'Interaktiv video', icon: Video, color: 'bg-red-600' },
    { label: 'Minnespel', icon: Grid, color: 'bg-pink-600' },
    { label: 'Fyll inn', icon: Type, color: 'bg-slate-600' },
    { label: 'Fleire saman', icon: Layers, color: 'bg-[linear-gradient(to_bottom_right,#0ea5e9_25%,#10b981_25%,#10b981_50%,#8b5cf6_50%,#8b5cf6_75%,#f43f5e_75%)]' },
  ];

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      {/* DEEP LINKING BANNER */}
      {isDeepLinking && (
          <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between animate-pulse" role="alert">
              <div className="flex items-center gap-6">
                  <div className="bg-white/20 p-4 rounded-2xl"><Plus size={32} aria-hidden="true"/></div>
                  <div>
                      <h2 className="text-3xl font-bold">Legg til i Canvas</h2>
                      <p className="text-blue-100 text-xl">Vel aktiviteten du vil setje inn, eller lag ein ny.</p>
                  </div>
              </div>
          </div>
      )}

      {/* CREATE NEW */}
      <section className="pt-6" aria-labelledby="create-heading">
        <h2 id="create-heading" className="text-6xl font-extrabold text-slate-900 mb-12">Opprett ny</h2>
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8" aria-label="Velg aktivitetstype">
          {types.map((t) => (
            <button key={t.label} onClick={() => onCreate(t.label)} className="group relative flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-[2rem] hover:border-cyan-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300" aria-label={`Opprett ny ${t.label}`}>
              <div className={`w-24 h-24 ${t.label !== 'Fleire saman' ? t.color : 'bg-transparent'} rounded-3xl flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-300 ${t.label !== 'Fleire saman' ? 'shadow-lg' : ''}`}>
                {t.label === 'Fleire saman' ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-16 h-16 bg-pink-500 rounded-2xl rotate-12 shadow-lg opacity-80 left-6 top-6"></div>
                    <div className="absolute w-16 h-16 bg-blue-500 rounded-2xl -rotate-6 shadow-lg opacity-90 right-6 top-3"></div>
                    <div className="absolute w-16 h-16 bg-amber-500 rounded-2xl shadow-xl z-10 flex items-center justify-center">
                      <t.icon className="text-white w-8 h-8" aria-hidden="true" />
                    </div>
                  </div>
                ) : (
                  <t.icon className="text-white w-12 h-12" aria-hidden="true" />
                )}
                <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-2 shadow-sm border border-slate-100 z-20"><Plus className="w-6 h-6 text-slate-400" strokeWidth={4} aria-hidden="true" /></div>
              </div>
              <span className="font-bold text-slate-800 text-xl text-center leading-tight">{t.label}</span>
            </button>
          ))}
        </nav>
      </section>

      {/* LIBRARY */}
      <section aria-labelledby="library-heading">
        <h2 id="library-heading" className="text-6xl font-extrabold text-slate-900 mb-12">Bibliotek ({activities.length})</h2>
        {activities.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem]">
            <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-500"><Layout size={64} aria-hidden="true"/></div>
            <p className="text-slate-700 font-bold text-3xl">Ingen aktivitetar oppretta enno.</p>
            <p className="text-slate-500 text-xl mt-4 max-w-md mx-auto">Vel ein type ovanfor for å starte.</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
            {activities.map((a) => (
            <article key={a.id} className={`bg-white p-10 rounded-[2rem] border transition-all group gap-8 flex flex-col sm:flex-row items-start sm:items-center justify-between ${isDeepLinking ? 'border-blue-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100' : 'border-slate-200 hover:shadow-xl hover:border-cyan-200'}`}>
              <div className="flex items-center gap-8 overflow-hidden w-full">
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center font-bold text-4xl shadow-inner flex-shrink-0 transition-colors ${isDeepLinking ? 'bg-blue-50 text-blue-600' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-cyan-50 group-hover:to-cyan-100 group-hover:text-cyan-700'}`} aria-hidden="true">
                    {a.type.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-bold text-3xl mb-2 truncate group-hover:text-cyan-900 ${!a.title ? 'text-slate-400 italic' : 'text-slate-900'}`}>{a.title || 'Utan tittel'}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-lg text-slate-600">
                      <span className="bg-slate-100 px-4 py-1.5 rounded-lg text-slate-700 font-bold text-sm uppercase tracking-wide border border-slate-200">{a.type}</span>
                      <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                    {a.description && <p className="text-lg text-slate-500 mt-4 truncate max-w-md opacity-80">{a.description}</p>}
                  </div>
              </div>
              <nav className="flex items-center gap-3 self-end sm:self-auto pl-4" aria-label={`Handlinger for ${a.title}`}>
                  {isDeepLinking && onSelect ? (
                      <button onClick={() => onSelect(a)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors font-bold text-xl shadow-lg shadow-blue-200 flex items-center gap-2">
                          <Plus size={24} aria-hidden="true"/> Vel
                      </button>
                  ) : (
                      <>
                        <button onClick={() => onPlay(a)} className="p-5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-2xl transition-colors" title="Spel" aria-label={`Spel ${a.title}`}>
                            <Play size={32} aria-hidden="true"/>
                        </button>
                        <button onClick={() => onEdit(a)} className="p-5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-2xl transition-colors" title="Rediger" aria-label={`Rediger ${a.title}`}>
                            <Pencil size={32} aria-hidden="true"/>
                        </button>
                        <div className="w-px h-12 bg-slate-200 mx-2" aria-hidden="true"></div>
                        <button onClick={() => onDuplicate(a)} className="p-5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-2xl transition-colors" title="Dupliser" aria-label={`Dupliser ${a.title}`}>
                            <Copy size={28} aria-hidden="true"/>
                        </button>
                        <DeleteButton onDelete={() => onDelete(a.id)} />
                      </>
                  )}
              </nav>
            </article>
          ))}</div>
        )}
      </section>
    </div>
  );
}
