import React, { useState } from 'react';
import { Lightbulb, Clock, Target, Layers, Puzzle, CircleAlert, CircleCheck, Pencil, Eye, Download, ArrowRight, Link as LinkIcon, Layout, ChevronRight, MousePointerClick, BookOpen, GraduationCap } from 'lucide-react';

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
        { name: 'Minnespel', desc: 'Ypparleg for å drille terminologi. Kople fagomgrep med definisjon eller bilete.' }
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
      title: 'Visuell Utforsking',
      description: 'Lèt studenten oppdage informasjon i sitt eige tempo.',
      color: 'bg-rose-500',
      shadow: 'shadow-rose-200',
      icon: <Eye className="w-8 h-8 text-white" />,
      items: [
        { name: 'Bilete Hotspot', desc: 'Perfekt for anatomi, utstyrsopplæring eller HMS (f.eks. finne feil i eit rom). La studenten utforske biletet fritt før du går gjennom teorien. Det skapar nysgjerrigheit.' }
      ]
    },
    {
      title: 'Djubdelæring i Video',
      description: 'Gjer passiv titting til aktiv læring.',
      color: 'bg-red-600',
      shadow: 'shadow-red-200',
      icon: <Clock className="w-8 h-8 text-white" />,
      items: [
        { name: 'Interaktiv Video', desc: 'Videoar kan gjerne vere lange når dei er interaktive! Legg inn stoppunkt undervegs for å "låse" kunnskapen og sikre at studenten heng med før dei går vidare.' }
      ]
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 space-y-24">
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {helpSections.map((section, idx) => (
            <div 
              key={section.title} 
              onMouseEnter={() => setActiveSection(section.title)}
              onMouseLeave={() => setActiveSection(null)}
              className={`group relative bg-white rounded-[2rem] overflow-hidden border border-slate-200 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 ${activeSection === section.title ? `ring-4 ring-offset-2 ring-${section.color.split('-')[1]}-200 ${section.shadow}` : ''}`}
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
              
              <div className="p-8 space-y-8 bg-slate-50 min-h-[300px]">
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
      <section className="max-w-7xl mx-auto px-4 mt-24">
         <div className="text-center text-slate-500 text-sm">
             <p>HVL Interaktiv er delvis basert på og inspirert av open kjeldekode frå <a href="https://h5p.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-700">H5P</a>.</p>
             <p>H5P er utgitt under MIT-lisensen. Copyright &copy; 2016 Joubel AS.</p>
         </div>
      </section>

    </div>
  );
};