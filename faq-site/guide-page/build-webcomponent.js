const fs = require('fs');
const path = require('path');

const mainPath = path.resolve(__dirname, 'dist/guide-page/browser/main.js');
const polyfillsPath = path.resolve(__dirname, 'dist/guide-page/browser/polyfills.js');
const outputPath = path.resolve(__dirname, 'dist/guide-page/bundle.js');

try {
  const polyfillsContent = fs.readFileSync(polyfillsPath, 'utf-8');
  const mainContent = fs.readFileSync(mainPath, 'utf-8');

  const bundle = `/* WebComponent bundle generado manualmente */\n${polyfillsContent}\n${mainContent}`;

  fs.writeFileSync(outputPath, bundle);
  console.log('✅ bundle.js generado exitosamente en un solo archivo.');
} catch (err) {
  console.error('❌ Error al generar el bundle:', err);
  process.exit(1);
}