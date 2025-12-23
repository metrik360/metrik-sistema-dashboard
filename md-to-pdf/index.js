#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de rutas
const CONFIG = {
  // Logos de MéTRIK
  logos: {
    main: path.resolve(__dirname, '../Marca/MéTRIK_Logo.png'),
    iso: path.resolve(__dirname, '../Marca/Métrik_logo_iso.png'),
    isotipo: path.resolve(__dirname, '../Marca/Metrik_Isotipo.png'),
  },
  // Colores corporativos
  colors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#0f3460',
    highlight: '#e94560',
    text: '#333333',
    lightGray: '#f5f5f5',
  },
  // Configuración del PDF
  pdf: {
    format: 'A4',
    margin: {
      top: '100px',
      bottom: '80px',
      left: '40px',
      right: '40px',
    },
  },
};

// Convertir imagen a base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).slice(1);
    return `data:image/${ext};base64,${base64}`;
  } catch (error) {
    console.error(`Error al cargar imagen: ${imagePath}`);
    return '';
  }
}

// Generar estilos CSS
function generateStyles(logoBase64) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: ${CONFIG.colors.text};
      background: white;
      padding: 20px 0;
    }

    .content {
      max-width: 100%;
    }

    /* Encabezados */
    h1 {
      font-size: 24pt;
      font-weight: 700;
      color: ${CONFIG.colors.primary};
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 3px solid ${CONFIG.colors.highlight};
    }

    h2 {
      font-size: 18pt;
      font-weight: 600;
      color: ${CONFIG.colors.secondary};
      margin-top: 28px;
      margin-bottom: 12px;
      padding-left: 12px;
      border-left: 4px solid ${CONFIG.colors.highlight};
    }

    h3 {
      font-size: 14pt;
      font-weight: 600;
      color: ${CONFIG.colors.accent};
      margin-top: 20px;
      margin-bottom: 10px;
    }

    h4, h5, h6 {
      font-size: 12pt;
      font-weight: 600;
      color: ${CONFIG.colors.text};
      margin-top: 16px;
      margin-bottom: 8px;
    }

    /* Párrafos */
    p {
      margin-bottom: 12px;
      text-align: justify;
    }

    /* Enlaces */
    a {
      color: ${CONFIG.colors.highlight};
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Listas */
    ul, ol {
      margin-bottom: 12px;
      padding-left: 24px;
    }

    li {
      margin-bottom: 6px;
    }

    li::marker {
      color: ${CONFIG.colors.highlight};
    }

    /* Código */
    code {
      font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
      font-size: 9pt;
      background: ${CONFIG.colors.lightGray};
      padding: 2px 6px;
      border-radius: 4px;
      color: ${CONFIG.colors.highlight};
    }

    pre {
      background: ${CONFIG.colors.primary};
      color: #f8f8f2;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 16px;
      border-left: 4px solid ${CONFIG.colors.highlight};
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }

    /* Tablas */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 10pt;
    }

    th {
      background: ${CONFIG.colors.primary};
      color: white;
      font-weight: 600;
      padding: 12px;
      text-align: left;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    tr:nth-child(even) {
      background: ${CONFIG.colors.lightGray};
    }

    /* Blockquotes */
    blockquote {
      border-left: 4px solid ${CONFIG.colors.highlight};
      background: ${CONFIG.colors.lightGray};
      padding: 12px 20px;
      margin: 16px 0;
      font-style: italic;
      color: #555;
    }

    /* Líneas horizontales */
    hr {
      border: none;
      height: 2px;
      background: linear-gradient(to right, ${CONFIG.colors.highlight}, transparent);
      margin: 24px 0;
    }

    /* Imágenes */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 12px 0;
    }

    /* Checkboxes para listas de tareas */
    input[type="checkbox"] {
      margin-right: 8px;
    }

    /* Header fijo */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 70px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      border-bottom: 2px solid ${CONFIG.colors.lightGray};
      z-index: 1000;
    }

    .header-logo {
      height: 45px;
      width: auto;
    }

    .header-title {
      font-size: 10pt;
      color: ${CONFIG.colors.text};
      font-weight: 500;
    }

    /* Footer fijo */
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      border-top: 2px solid ${CONFIG.colors.highlight};
      font-size: 9pt;
      color: #666;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .footer-logo {
      height: 25px;
      width: auto;
    }

    /* Saltos de página */
    .page-break {
      page-break-after: always;
    }

    @media print {
      body {
        padding-top: 80px;
        padding-bottom: 60px;
      }

      .header, .footer {
        position: fixed;
      }
    }
  `;
}

// Generar HTML completo
function generateHTML(markdownContent, title, logoMainBase64, logoIsoBase64) {
  const htmlContent = marked.parse(markdownContent);
  const styles = generateStyles(logoMainBase64);
  const currentDate = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="header">
        <img src="${logoMainBase64}" alt="MéTRIK Logo" class="header-logo">
        <span class="header-title">${title}</span>
      </div>

      <div class="content">
        ${htmlContent}
      </div>

      <div class="footer">
        <div class="footer-brand">
          <img src="${logoIsoBase64}" alt="MéTRIK" class="footer-logo">
          <span>MéTRIK - Soluciones Digitales</span>
        </div>
        <span>${currentDate}</span>
      </div>
    </body>
    </html>
  `;
}

// Función principal de conversión
async function convertMdToPdf(inputPath, outputPath = null) {
  console.log('\n🚀 MéTRIK Markdown to PDF Converter\n');
  console.log('━'.repeat(50));

  // Verificar que el archivo existe
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: El archivo no existe: ${inputPath}`);
    process.exit(1);
  }

  // Leer el archivo Markdown
  console.log(`📄 Leyendo archivo: ${path.basename(inputPath)}`);
  const markdownContent = fs.readFileSync(inputPath, 'utf-8');

  // Determinar el título (primera línea H1 o nombre del archivo)
  const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : path.basename(inputPath, '.md');

  // Cargar logos como base64
  console.log('🖼️  Cargando logos de MéTRIK...');
  const logoMainBase64 = imageToBase64(CONFIG.logos.main);
  const logoIsoBase64 = imageToBase64(CONFIG.logos.iso);

  if (!logoMainBase64 || !logoIsoBase64) {
    console.warn('⚠️  Advertencia: Algunos logos no se pudieron cargar');
  }

  // Generar HTML
  console.log('📝 Generando documento...');
  const html = generateHTML(markdownContent, title, logoMainBase64, logoIsoBase64);

  // Determinar ruta de salida
  if (!outputPath) {
    outputPath = inputPath.replace(/\.md$/i, '.pdf');
  }

  // Generar PDF con Puppeteer
  console.log('📑 Generando PDF...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: CONFIG.pdf.format,
    margin: CONFIG.pdf.margin,
    printBackground: true,
    displayHeaderFooter: false,
  });

  await browser.close();

  console.log('━'.repeat(50));
  console.log(`✅ PDF generado exitosamente: ${outputPath}`);
  console.log(`📊 Tamaño: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

  return outputPath;
}

// Función para convertir múltiples archivos
async function convertMultipleFiles(inputDir, outputDir = null) {
  const files = fs.readdirSync(inputDir).filter((f) => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('❌ No se encontraron archivos .md en el directorio');
    return;
  }

  console.log(`📁 Encontrados ${files.length} archivos Markdown\n`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = outputDir
      ? path.join(outputDir, file.replace(/\.md$/i, '.pdf'))
      : null;

    await convertMdToPdf(inputPath, outputPath);
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║           MéTRIK - Markdown to PDF Converter                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Uso:                                                          ║
║    node index.js <archivo.md>              Convertir archivo   ║
║    node index.js <archivo.md> <salida.pdf> Especificar salida  ║
║    node index.js --dir <directorio>        Convertir carpeta   ║
║                                                                ║
║  Ejemplos:                                                     ║
║    node index.js documento.md                                  ║
║    node index.js informe.md ./salida/informe.pdf               ║
║    node index.js --dir ./documentos                            ║
║                                                                ║
║  Los PDFs incluirán automáticamente:                           ║
║    • Logo de MéTRIK en el encabezado                           ║
║    • Isotipo en el pie de página                               ║
║    • Fecha de generación                                       ║
║    • Estilos corporativos                                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
    process.exit(0);
  }

  try {
    if (args[0] === '--dir' && args[1]) {
      await convertMultipleFiles(args[1], args[2]);
    } else {
      await convertMdToPdf(args[0], args[1]);
    }
  } catch (error) {
    console.error('❌ Error durante la conversión:', error.message);
    process.exit(1);
  }
}

main();
