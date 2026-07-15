import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (
      stat.isFile() &&
      (file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.scss'))
    ) {
      callback(filePath);
    }
  }
}

const targetDir = path.resolve(__dirname, '../../apps/demo/src/app');
console.log(`Scanning directory: ${targetDir}`);

walkDir(targetDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('—')) {
    console.log(`Replacing em-dashes in: ${filePath}`);
    const updated = content.replace(/—/g, '-');
    fs.writeFileSync(filePath, updated, 'utf8');
  }
});

console.log('Em-dash replacement complete.');
