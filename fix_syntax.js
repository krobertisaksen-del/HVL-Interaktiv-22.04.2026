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
  
  // Fix the syntax error injected: \`() => onSuccess(result); setReported(true); }}\` -> \`() => { onSuccess(result); setReported(true); }\`
  content = content.replace(/onClick=\{\(\) => onSuccess\((.*?\)?)\); setReported\(true\); \}\}/g, 'onClick={() => { onSuccess($1); setReported(true); }}');
  content = content.replace(/onClick=\{\(\) => onSuccess && onSuccess\((.*?\)?)\); setReported\(true\); \}\}/g, 'onClick={() => { if(onSuccess) onSuccess($1); setReported(true); }}');
  content = content.replace(/onClick=\{\(\) => onSuccess \? onSuccess\((.*?)\) : setFinished\(true\); setReported\(true\); \}\}/g, 'onClick={() => { if(onSuccess) { onSuccess($1); setReported(true); } else setFinished(true); }}');
  
  fs.writeFileSync(file, content);
}
