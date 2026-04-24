
export function getDefaultData(type: string) {
  switch (type) {
    case 'Fleirval': return { questions: [{ id: 1, question: 'Kva er hovudstaden i Noreg?', options: [{id: 1, text: 'Bergen', correct: false}, {id: 2, text: 'Oslo', correct: true}, {id: 3, text: '', correct: false}] }] };
    case 'Sant/usant': return { questions: [{ id: 1, question: 'HVL blei etablert i 2017.', isTrue: true }] };
    case 'Fyll inn': return { blocks: [{id: 1, text: 'Høgskulen på Vestlandet har *fem* campusar.' }] };
    case 'Bilete-hotspot': return { scenes: [{ id: 1, imageUrl: 'https://picsum.photos/id/1015/1200/800', altText: 'Fjord og fjell', hotspots: [] }] };
    case 'Interaktiv video': return { scenes: [{ id: 1, videoUrl: '', interactions: [] }] };
    case 'Tidslinje': return { headline: 'Historie', events: [{id: 1, date: '2017', title: 'HVL etablert', body: 'HVL vart oppretta.', mediaUrl: '', mediaType: ''}] };
    case 'Dra og slepp': return { tasks: [{ id: 1, backgroundUrl: 'https://picsum.photos/id/1018/1200/800', altText: 'Bakgrunn', items: [], zones: [] }] };
    case 'Minnespel': return { cards: [{ id: 1, content: 'A', pairId: 1 }, { id: 2, content: 'B', pairId: 1 }] };
    case 'Fleire saman': return { items: [] };
    default: return {};
  }
}

;
