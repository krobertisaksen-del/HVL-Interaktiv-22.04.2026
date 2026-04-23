import React, { useState } from 'react';
import { Lightbulb, Clock, Target, Layers, Puzzle, CircleAlert, CircleCheck, Pencil, Eye, Download, ArrowRight, Link as LinkIcon, Layout, ChevronRight, MousePointerClick, BookOpen, GraduationCap, MonitorPlay } from 'lucide-react';

export const HelpPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const helpSections = [
    {
      title: 'Mengdetrening og Omgrepskontroll',
      description: 'Best for rask sjekk av faktakunnskap og repetisjon.',
      color: 'bg-cyan-600',
      shadow: 'shadow-cyan-200',
      icon: <Target className="w-8 h-8 text-white" />,
      items: [
        { name: 'Fleirval & Sant/usant', desc: 'Bruk desse som "inngangsbillett" før synkron undervisning for å aktivere forkunnskapar, eller som repetisjon rett etterpå.' },
        { name: 'Minnespel', desc: 'Ypparleg for å drille terminologi. Kople fagomgrep med definisjon eller bilete.' },
        { name: 'Fyll inn', desc: 'Testar nøyaktig hukommelse og staving av viktige omgrep i kontekst.'}
      ]
    },
    {
      title: 'Prosess og Samanheng',
      description: 'Hjelper studenten å forstå rekkjefølgje og relasjonar.',
      color: 'bg-indigo-600',
      shadow: 'shadow-indigo-200',
      icon: <Layers className="w-8 h-8 text-white" />,
      items: [
        { name: 'Tidslinje', desc: 'Vis utvikling over tid, historiske hendingar eller steg i ein prosess.' },
        { name: 'Dra og Slepp', desc: 'Tvingar studenten til å kategorisere informasjon. Pedagogisk tips: Be studenten sortere årsak og verknad, eller plasser element i rett kontekst.' }
      ]
    },
    {
      title: 'Multimedial Utforsking',
      description: 'Gjer passiv titting til aktiv læring, og lèt studenten oppdage i eige tempo.',
      color: 'bg-rose-600',
      shadow: 'shadow-rose-200',
      icon: <MonitorPlay className="w-8 h-8 text-white" />,
      items: [
        { name: 'Bilete Hotspot', desc: 'Perfekt for anatomi, utstyrsopplæring eller HMS (f.eks. finne feil i eit rom). La studenten utforske biletet fritt før du går gjennom teorien. Det skapar nysgjerrigheit.' },
        { name: 'Interaktiv Video', desc: 'Videoar kan gjerne vere lange når dei er interaktive! Legg inn stoppunkt undervegs for å "låse" kunnskapen og sikre at studenten heng med før dei går vidare.' }
      ]
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-[70px] space-y-[70px]">
      {/* HERO SECTION */}
      <section className="text-center max-w-5xl mx-auto pt-16 relative">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl opacity-20 pointer-events-none">
           <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_4s_infinite]"></div>
           <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_5s_infinite]"></div>
           <div className="absolute -bottom-10 left-20 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_6s_infinite]"></div>
        </div>

        <div className="relative group cursor-pointer inline-block">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-cyan-200/50 mx-auto mb-10 transform group-hover:-translate-y-4 group-hover:rotate-12 transition-all duration-500">
            <Lightbulb className="text-white w-16 h-16 group-hover:animate-pulse" />
          </div>
        </div>
        <h2 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 mb-8 tracking-tight">Engasjerande Asynkron Læring</h2>
        <p className="text-3xl text-slate-600 leading-relaxed font-medium max-w-4xl mx-auto">
          Målet er at digital undervising utanom sanntid skal vere engasjerande, og at formativ vurdering skal vere ein naturleg del av kvardagen til studenten.
        </p>
      </section>

      {/* DEFINITIONS (Interactive Cards) */}
      <section className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto px-4">
        <div className="group bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-cyan-100 hover:-translate-y-2 transition-all duration-500 cursor-default">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 shrink-0 bg-cyan-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-100 transition-all duration-500">
               <Clock className="w-10 h-10 text-cyan-600"/>
            </div>
            <h3 className="font-bold text-slate-900 text-3xl md:text-4xl group-hover:text-cyan-700 transition-colors">Asynkron undervising</h3>
          </div>
          <p className="text-slate-600 text-2xl leading-relaxed font-medium group-hover:text-slate-800 transition-colors">Undervising som ikkje skjer i sanntid. Studenten jobbar med lærestoffet når det passar dei, typisk gjennom videoar, tekstar og interaktive oppgåver.</p>
        </div>
        <div className="group bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-500 cursor-default">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 shrink-0 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-500">
               <Target className="w-10 h-10 text-indigo-600"/>
            </div>
            <h3 className="font-bold text-slate-900 text-3xl md:text-4xl group-hover:text-indigo-700 transition-colors">Formativ vurdering</h3>
          </div>
          <p className="text-slate-600 text-2xl leading-relaxed font-medium group-hover:text-slate-800 transition-colors">Vurdering <em>for</em> læring. Målet er ikkje karakterar, men å gi studenten løpande tilbakemelding på kva dei kan, og kva dei må jobbe meir med.</p>
        </div>
      </section>

      {/* INTERACTIVE TOOLBOX */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-extrabold text-slate-900 mb-6">Verktøykassa</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpSections.map((section, idx) => (
            <div 
              key={section.title} 
              onMouseEnter={() => setActiveSection(section.title)}
              onMouseLeave={() => setActiveSection(null)}
              className={`group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-200 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 ${activeSection === section.title ? `ring-4 ring-offset-2 ring-${section.color.split('-')[1]}-200 ${section.shadow}` : ''}`}
            >
              <div className={`${section.color} px-8 pt-12 text-white h-[380px] flex flex-col justify-start transition-all duration-500 relative overflow-hidden`}>
                {/* Decorative background element */}
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 p-5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                     {section.icon}
                  </div>
                  <h4 className="font-bold text-3xl mb-4 leading-tight">{section.title}</h4>
                  <p className="text-white/90 text-lg font-medium">{section.description}</p>
                </div>
              </div>
              
              <div className="p-8 space-y-8 bg-slate-50 min-h-[300px] flex-1">
                {section.items.map((item) => (
                  <div key={item.name} className="transform opacity-100 transition-all duration-500 delay-100">
                    <h5 className="font-bold text-slate-900 mb-3 text-2xl flex items-center gap-2">
                       <ChevronRight className={`w-6 h-6 flex-shrink-0 ${section.color.replace('bg-', 'text-')} transition-all`} />
                       {item.name}
                    </h5>
                    <p className="text-slate-600 text-xl leading-relaxed font-medium pl-8">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLERE SAMAN DEEP DIVE */}
      <section className="px-4 -mt-12">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-12 lg:p-16 rounded-[3rem] border-2 border-purple-100 max-w-7xl mx-auto shadow-2xl shadow-purple-900/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-400/30 transition-colors duration-1000 group-hover:scale-110"></div>
          
          <div className="flex flex-col md:flex-row gap-16 items-center relative z-10">
            <div className="flex-1">
              <h3 className="text-4xl lg:text-5xl font-extrabold text-purple-900 mb-6 flex items-center gap-4">
                  <div className="group-hover:scale-110 transition-transform duration-500 origin-center relative w-16 h-16 mr-2 flex-shrink-0">
                    <div className="absolute w-12 h-12 bg-pink-500 rounded-xl rotate-12 shadow-lg opacity-80 left-0 top-0 group-hover:rotate-45 transition-transform duration-700"></div>
                    <div className="absolute w-12 h-12 bg-blue-500 rounded-xl -rotate-6 shadow-lg opacity-90 right-0 top-1 group-hover:-rotate-45 transition-transform duration-700"></div>
                    <div className="absolute w-12 h-12 bg-amber-500 rounded-xl shadow-xl z-10 flex items-center justify-center left-2 top-2">
                       <Layers size={24} className="text-white"/>
                    </div>
                  </div>
                  Samansette læringsløp ("Fleire saman")
              </h3>
              <p className="text-purple-900/90 mb-8 leading-relaxed text-2xl font-medium">
                Dette verktøyet lèt deg setje saman fleire små aktivitetar til ein lengre sekvens. I staden for å gi studenten éi gigantisk oppgåve, deler du læringa opp i mindre bitar.
              </p>
              <div className="space-y-6">
                  <div className="flex gap-5 items-start">
                      <div className="bg-white p-4 rounded-2xl shadow-sm text-purple-600 mt-1 border border-purple-100 group-hover:-translate-y-1 transition-transform duration-300"><Puzzle size={32} className="group-hover:animate-bounce"/></div>
                      <div>
                          <h5 className="font-bold text-purple-900 text-3xl mb-2 group-hover:text-purple-700 transition-colors">Kvifor mikrolæring?</h5>
                          <p className="text-purple-900/80 text-2xl font-medium leading-relaxed">Store oppgåver kan verke overveldande (kognitiv overbelasting). Ved å dele opp stoffet får studenten hyppigare meistringskjensle og motivasjon til å halde fram.</p>
                      </div>
                  </div>
              </div>
            </div>
            <div className="w-full md:w-5/12 bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl border border-white rotate-2 group-hover:-rotate-1 group-hover:scale-105 transition-all duration-500 ease-out">
               <div className="space-y-4 relative">
                   {/* Progress bar mock */}
                   <div className="flex gap-2 mb-2 px-2">
                      <div className="h-2 flex-1 bg-cyan-500 rounded-full"></div>
                      <div className="h-2 flex-1 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
                      <div className="h-2 flex-1 bg-slate-200 rounded-full"></div>
                      <div className="h-2 flex-1 bg-slate-200 rounded-full"></div>
                   </div>
                   
                   {/* Video mock */}
                   <div className="aspect-video bg-slate-900 rounded-xl w-full relative overflow-hidden flex items-center justify-center shadow-inner group-hover:shadow-lg transition-shadow duration-300">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                         {/* Play triangle */}
                         <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[14px] border-transparent border-l-white ml-1"></div>
                      </div>
                      {/* Timeline */}
                      <div className="absolute bottom-3 left-4 right-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 w-1/2 relative">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                          </div>
                      </div>
                      {/* Interactivity dot */}
                      <div className="absolute bottom-3 left-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,1)] -translate-y-[3px]"></div>
                   </div>
                   
                   {/* Quiz mock popover */}
                   <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 shadow-xl translate-x-4 -translate-y-6 rotate-3 relative z-10 group-hover:rotate-0 group-hover:translate-x-2 group-hover:-translate-y-8 transition-all duration-500">
                      <div className="h-3 bg-slate-300 w-2/3 rounded-full mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-9 bg-white border border-slate-200 rounded-lg flex items-center px-3 hover:border-cyan-300 transition-colors">
                           <div className="w-4 h-4 rounded-full border-2 border-slate-300 mr-3"></div>
                           <div className="h-2 bg-slate-200 w-1/2 rounded-full"></div>
                        </div>
                        <div className="h-9 bg-cyan-50 border border-cyan-300 rounded-lg flex items-center px-3">
                           <div className="w-4 h-4 rounded-full border-[4px] border-cyan-500 mr-3"></div>
                           <div className="h-2 bg-cyan-800 w-3/4 rounded-full"></div>
                        </div>
                      </div>
                   </div>
               </div>
               <p className="text-center text-sm text-slate-500 italic font-medium group-hover:text-purple-600 transition-colors duration-500 mt-2">Døme: Video + Spørsmål</p>
            </div>
          </div>
        </div>
      </section>

      {/* PEDAGOGICAL TIPS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-4">
           <div className="inline-flex items-center gap-3 text-amber-700 px-8 py-4 rounded-full font-extrabold text-4xl mb-6">
              <Lightbulb size={40} className="text-amber-500" /> God praksis
           </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[2.5rem] border border-yellow-200 shadow-xl shadow-yellow-900/5 hover:-translate-y-4 hover:shadow-2xl hover:shadow-yellow-900/10 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-50 z-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-yellow-900 mb-6 flex items-center gap-4 text-3xl">
                      <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-yellow-200 transition-all duration-300"><CircleAlert size={32} /></div> 
                      Feil er læring
                  </h4>
                  <p className="text-slate-700 text-2xl leading-relaxed font-medium">
                      Appen gir tilbakemelding på feil svar. Bruk dette bevisst ved å lage «gode» svaralternativ som avslører vanlege misoppfatningar i faget ditt. Det er nemleg når studenten svarer feil og får ei forklaring (eller må prøve evig mange gonger til dei finn rett) at læringa ofte skjer.
                  </p>
                </div>
            </div>
            <div className="bg-white p-12 rounded-[2.5rem] border border-emerald-200 shadow-xl shadow-emerald-900/5 hover:-translate-y-4 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-50 z-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-emerald-900 mb-6 flex items-center gap-4 text-3xl">
                      <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-300"><CircleCheck size={32} /></div>
                      Krav om meistring
                  </h4>
                  <p className="text-slate-700 text-2xl leading-relaxed font-medium">
                      Aktivitetane krev at studenten får alt riktig for å fullføre. Fordi dei ikkje berre kan klikke seg gjennom, bør du halde aktivitetane korte og fokusere strengt på kjernekonsepta. Ein for lang test med meistringskrav skapar fort frustrasjon, medan små, overkomelege oppgåver bygger sjølvtillit og sikrar djup refleksjon.
                  </p>
                </div>
            </div>
        </div>
      </section>

      {/* CANVAS EMBED GUIDE FOR USERS (TEACHERS) */}
      <section className="px-4">
        <div className="bg-slate-900 text-white p-12 lg:p-16 rounded-[3rem] border border-slate-800 shadow-2xl max-w-7xl mx-auto relative overflow-hidden group">
          {/* Abstract Canvas Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-red-600/20 transition-colors duration-1000"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-3 bg-red-500/20 text-red-300 px-6 py-3 rounded-full font-bold text-lg border border-red-500/30">
                     <GraduationCap size={24} /> Canvas Integrasjon
                  </div>
                  <h3 className="text-5xl font-extrabold flex items-center gap-4">Korleis bruke i Canvas?</h3>
                  <p className="text-2xl text-slate-300 leading-relaxed font-medium">
                      Som undervisar er det svært enkelt å leggje til desse oppgåvene rett inn i emna dine. Løysinga er fullt integrert via LTI.
                  </p>
                  
                  <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700">
                      <ol className="space-y-8 text-2xl text-slate-200 font-medium relative">
                          <li className="flex gap-6 items-start group/step cursor-default">
                             <div className="w-12 h-12 rounded-full bg-cyan-900 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0 group-hover/step:bg-cyan-500 group-hover/step:text-white transition-colors duration-300">1</div>
                             <div>Gå til <strong>Moduler</strong> eller opprett ei ny <strong>Oppgåve</strong> i ditt Canvas-emne.</div>
                          </li>
                          <li className="flex gap-6 items-start group/step cursor-default">
                             <div className="w-12 h-12 rounded-full bg-cyan-900 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0 group-hover/step:bg-cyan-500 group-hover/step:text-white transition-colors duration-300">2</div>
                             <div>Klikk på <strong>Legg til element</strong> (+) og vel <strong>Eksternt verktøy</strong> (External Tool) frå nedtrekksmenyen.</div>
                          </li>
                          <li className="flex gap-6 items-start group/step cursor-default">
                             <div className="w-12 h-12 rounded-full bg-cyan-900 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0 group-hover/step:bg-cyan-500 group-hover/step:text-white transition-colors duration-300">3</div>
                             <div>Finn og klikk på <strong>HVL Interaktiv</strong> i lista over tilgjengelege verktøy.</div>
                          </li>
                          <li className="flex gap-6 items-start group/step cursor-default">
                             <div className="w-12 h-12 rounded-full bg-cyan-900 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0 group-hover/step:bg-cyan-500 group-hover/step:text-white transition-colors duration-300">4</div>
                             <div>Appen opnar seg direkte i Canvas. Du kan no byggje ei ny oppgåve, eller klikke på <strong className="text-blue-400">Velg</strong>-knappen på ei eksisterande oppgåve frå biblioteket ditt.</div>
                          </li>
                      </ol>
                  </div>
              </div>
          </div>
        </div>
      </section>
      
      {/* LICENSE SECTION */}
      <section className="max-w-7xl mx-auto px-4">
         <div className="text-center text-slate-500 text-sm">
             <p>HVL Interaktiv er delvis basert på og inspirert av open kjeldekode frå <a href="https://h5p.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-700">H5P</a>.</p>
             <p>H5P er utgitt under MIT-lisensen. Copyright &copy; 2016 Joubel AS.</p>
         </div>
      </section>

    </div>
  );
};