const fs = require('fs');

const files = [
  'components/players/ClozePlayer.tsx',
  'components/players/DragDropPlayer.tsx',
  'components/players/HotspotPlayer.tsx',
  'components/players/MCPlayer.tsx',
  'components/players/MemoryPlayer.tsx',
  'components/players/TFPlayer.tsx',
  'components/players/TimelinePlayer.tsx',
  'components/players/VideoPlayer.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('const [reported, setReported]') === false) {
      content = content.replace(/(const \[finished, setFinished\] = useState\(false\);)/, '$1\n  const [reported, setReported] = useState(false);');
  }

  content = content.replace(
      /\} className="(px-\d+ py-\d+) bg-(green|cyan)(-\d+) text-white rounded-xl font-bold([^"]*)">(Fortsett|Fullført)<\/button>/g,
      `; setReported(true); }} disabled={reported} className={\`$1 text-white rounded-xl font-bold$4 \${reported ? 'bg-slate-300 pointer-events-none' : 'bg-$2$3 hover:bg-$2-700'}\`}>{reported ? 'Ferdig ✓' : '$5'}</button>`
  );

  fs.writeFileSync(file, content);
}
