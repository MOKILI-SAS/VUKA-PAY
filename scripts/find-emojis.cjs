const fs = require('fs');
const path = require('path');

// Regex for emoji characters
const emojiRegex = /[\p{Extended_Pictographic}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

function scanDir(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDir(fullPath, results);
      }
    } else if (/\.(tsx|ts|jsx|js|html|css)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (emojiRegex.test(line)) {
          results.push({ file: fullPath, lineNum: idx + 1, line: line.trim() });
        }
      });
    }
  }
  return results;
}

const hits = scanDir(path.resolve(__dirname, '../src'));
console.log(`Found ${hits.length} emoji occurrences:`);
hits.forEach(h => console.log(`${h.file}:${h.lineNum} -> ${h.line}`));
