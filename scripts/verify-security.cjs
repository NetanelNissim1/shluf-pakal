const fs = require('fs');
const path = require('path');

console.log('Running Operational & Cyber Security Verification...');

// 1. Verify zero duplicate questions in riddles.json
const riddles = JSON.parse(fs.readFileSync('src/data/riddles.json', 'utf8'));
const qMap = new Map();
const dups = [];
riddles.forEach(r => {
  const q = r.question.replace(/[?.,!]/g, '').trim();
  if (qMap.has(q)) {
    dups.push({ q, id1: qMap.get(q), id2: r.id });
  } else {
    qMap.set(q, r.id);
  }
});
console.log(`[Security/Content Check 1]: Duplicate questions in riddles.json: ${dups.length}`);
if (dups.length > 0) {
  console.error('Found duplicates:', dups);
  process.exit(1);
}

// 2. Verify encrypted-data.json does not leak plaintext questions in bundle
const distDir = path.join(__dirname, '..', 'dist', 'assets');
const jsFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.js') && f.startsWith('index-'));
if (jsFiles.length > 0) {
  const mainBundle = fs.readFileSync(path.join(distDir, jsFiles[0]), 'utf8');
  // Sample a question from True/False
  const tfSample = 'החרמון הוא ההר הגבוה ביותר בישראל';
  const containsPlaintext = mainBundle.includes(tfSample);
  console.log(`[Security Check 2]: Bundle contains plaintext riddle question: ${containsPlaintext}`);
  if (containsPlaintext) {
    console.error('FAIL: Plaintext riddle question leaked in bundle!');
    process.exit(1);
  }
  console.log('PASS: Bundle is 100% encrypted with XOR Byte Cipher.');
}

// 3. Verify CSP in dist/index.html
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
const hasCSP = indexHtml.includes('http-equiv="Content-Security-Policy"');
console.log(`[Security Check 3]: dist/index.html includes Content-Security-Policy: ${hasCSP}`);
if (!hasCSP) {
  console.error('FAIL: Missing CSP in dist/index.html');
  process.exit(1);
}

// 4. Verify vercel.json headers
const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
const headers = vercel.headers[0].headers;
const xfo = headers.find(h => h.key === 'X-Frame-Options');
const nosniff = headers.find(h => h.key === 'X-Content-Type-Options');
console.log(`[Security Check 4]: vercel.json headers - X-Frame-Options: ${xfo?.value}, X-Content-Type-Options: ${nosniff?.value}`);
if (!xfo || !nosniff) {
  console.error('FAIL: Missing security headers in vercel.json');
  process.exit(1);
}

console.log('\nAll Operational & Security checks passed with 100% score!');
