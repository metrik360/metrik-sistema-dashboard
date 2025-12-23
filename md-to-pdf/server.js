import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Ruta raíz de MéTRIK donde se guardarán los PDFs
const METRIK_ROOT = path.resolve(__dirname, '..');

// Configuración según Manual de Marca MéTRIK
const CONFIG = {
  logos: {
    main: path.resolve(__dirname, '../Marca/MéTRIK_Logo.png'),
    iso: path.resolve(__dirname, '../Marca/Metrik_Isotipo.png'),
  },
  // Paleta de colores oficial MéTRIK
  colors: {
    negroCarbon: '#1A1A1A',      // Color principal - textos, logo
    grisAcero: '#6B7280',        // Color secundario - textos secundarios
    verdeMetrica: '#10B981',     // Color de acento - CTAs, KPIs positivos
    grisLinea: '#E5E7EB',        // Grids, tablas, separadores
    blanco: '#FFFFFF',           // Fondos
    rojoAlerta: '#EF4444',       // KPIs fuera de rango
    amarilloWarning: '#F59E0B',  // Métricas en riesgo
  },
  pdf: {
    format: 'A4',
    margin: { top: '90px', bottom: '70px', left: '60px', right: '60px' },
  },
};

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Convertir imagen a base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).slice(1);
    return `data:image/${ext};base64,${base64}`;
  } catch {
    return '';
  }
}

// Generar estilos CSS para PDF - Basado en Manual de Marca MéTRIK
function generateStyles() {
  const c = CONFIG.colors;
  return `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

    body {
      font-family: 'Montserrat', 'Inter', 'Helvetica Neue', sans-serif;
      font-size: 12pt;
      font-weight: 400;
      line-height: 1.6;
      color: ${c.negroCarbon};
      background: ${c.blanco};
      padding: 20px 0;
    }

    .content { max-width: 100%; }

    /* H1 - Títulos Principales: Montserrat Bold 20pt */
    h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 20pt;
      font-weight: 700;
      color: ${c.negroCarbon};
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 2px solid ${c.verdeMetrica};
      letter-spacing: 0.02em;
      line-height: 1.2;
    }

    /* H2 - Títulos Secundarios: Montserrat SemiBold 16pt */
    h2 {
      font-family: 'Montserrat', sans-serif;
      font-size: 16pt;
      font-weight: 600;
      color: ${c.negroCarbon};
      margin-top: 24px;
      margin-bottom: 12px;
      letter-spacing: 0.01em;
      line-height: 1.3;
    }

    /* H3 - Subtítulos: Montserrat Medium 14pt */
    h3 {
      font-family: 'Montserrat', sans-serif;
      font-size: 14pt;
      font-weight: 500;
      color: ${c.grisAcero};
      margin-top: 20px;
      margin-bottom: 10px;
      line-height: 1.4;
    }

    h4, h5, h6 {
      font-family: 'Montserrat', sans-serif;
      font-size: 12pt;
      font-weight: 600;
      color: ${c.negroCarbon};
      margin-top: 16px;
      margin-bottom: 8px;
    }

    /* Cuerpo de texto: Montserrat Regular 12pt */
    p {
      font-weight: 400;
      color: ${c.grisAcero};
      margin-bottom: 12px;
      text-align: justify;
      line-height: 1.6;
    }

    /* Enlaces con Verde Métrica */
    a {
      color: ${c.verdeMetrica};
      text-decoration: none;
      font-weight: 500;
    }

    /* Listas */
    ul, ol {
      margin-bottom: 12px;
      padding-left: 24px;
      color: ${c.grisAcero};
    }

    li {
      margin-bottom: 6px;
      line-height: 1.5;
    }

    li::marker {
      color: ${c.verdeMetrica};
    }

    /* Código: JetBrains Mono */
    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 9pt;
      background: #F9FAFB;
      padding: 2px 6px;
      border-radius: 4px;
      color: ${c.negroCarbon};
      border: 1px solid ${c.grisLinea};
    }

    pre {
      background: ${c.negroCarbon};
      color: #f8f8f2;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 16px;
      border-left: 3px solid ${c.verdeMetrica};
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }

    /* Tablas */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 10pt;
    }

    th {
      background: ${c.negroCarbon};
      color: ${c.blanco};
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      padding: 12px;
      text-align: left;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid ${c.grisLinea};
      color: ${c.grisAcero};
    }

    tr:nth-child(even) {
      background: #F9FAFB;
    }

    /* Blockquotes */
    blockquote {
      border-left: 3px solid ${c.verdeMetrica};
      background: #F9FAFB;
      padding: 12px 20px;
      margin: 16px 0;
      font-style: italic;
      color: ${c.grisAcero};
    }

    /* Líneas horizontales */
    hr {
      border: none;
      height: 1px;
      background: ${c.grisLinea};
      margin: 24px 0;
    }

    /* Imágenes */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 12px 0;
    }

    /* Strong/Bold con Negro Carbón */
    strong, b {
      font-weight: 700;
      color: ${c.negroCarbon};
    }
  `;
}

// Generar HTML para PDF (sin header/footer - los maneja Puppeteer)
function generateHTML(markdownContent, title) {
  const htmlContent = marked.parse(markdownContent);
  const styles = generateStyles();

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="content">${htmlContent}</div>
    </body>
    </html>
  `;
}

// Función para convertir contenido MD a PDF
async function convertMarkdownToPdf(markdownContent, fileName) {
  const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
  const baseName = fileName.replace(/\.md$/i, '');
  const title = titleMatch ? titleMatch[1] : baseName;

  const logoMainBase64 = imageToBase64(CONFIG.logos.main);
  const logoIsoBase64 = imageToBase64(CONFIG.logos.iso);
  const html = generateHTML(markdownContent, title);

  const outputPath = path.join(METRIK_ROOT, `${baseName}.pdf`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Generar PDF con header/footer nativo de Puppeteer para número de página
  await page.pdf({
    path: outputPath,
    format: CONFIG.pdf.format,
    margin: CONFIG.pdf.margin,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; padding: 0 60px; display: flex; align-items: center;">
        <img src="${logoMainBase64}" style="height: 40px; width: auto;" />
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; padding: 0 60px; display: flex; align-items: center; justify-content: space-between; font-family: 'Montserrat', 'Helvetica Neue', sans-serif; font-size: 9px; color: #6B7280;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="${logoIsoBase64}" style="height: 16px; width: auto;" />
        </div>
        <div>
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
        <div style="font-size: 9px;">
          ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    `,
  });

  await browser.close();

  const stats = fs.statSync(outputPath);

  return {
    success: true,
    outputPath,
    fileName: `${baseName}.pdf`,
    size: `${(stats.size / 1024).toFixed(2)} KB`,
  };
}

// Favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// API: Convertir archivo subido (drag & drop)
app.post('/api/convert-upload', async (req, res) => {
  const { content, fileName } = req.body;

  if (!content || !fileName) {
    return res.status(400).json({ error: 'Se requiere contenido y nombre del archivo' });
  }

  if (!fileName.endsWith('.md')) {
    return res.status(400).json({ error: 'El archivo debe tener extensión .md' });
  }

  try {
    const result = await convertMarkdownToPdf(content, fileName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Convertir por ruta de archivo
app.post('/api/convert', async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: 'Se requiere la ruta del archivo' });
  }

  let absolutePath = filePath;
  if (!path.isAbsolute(filePath)) {
    absolutePath = path.resolve(filePath);
  }

  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ error: `Archivo no encontrado: ${absolutePath}` });
  }

  if (!absolutePath.endsWith('.md')) {
    return res.status(400).json({ error: 'El archivo debe tener extensión .md' });
  }

  try {
    const markdownContent = fs.readFileSync(absolutePath, 'utf-8');
    const fileName = path.basename(absolutePath);
    const result = await convertMarkdownToPdf(markdownContent, fileName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Interfaz HTML con Drag & Drop
app.get('/', (req, res) => {
  const logoBase64 = imageToBase64(CONFIG.logos.main);

  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MéTRIK - Conversor MD a PDF</title>
  <link rel="icon" href="data:,">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
      padding: 50px;
      max-width: 600px;
      width: 100%;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      height: 60px;
      margin-bottom: 20px;
    }

    h1 {
      color: #1a1a2e;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
    }

    /* Drop Zone */
    .drop-zone {
      border: 3px dashed #e0e0e0;
      border-radius: 16px;
      padding: 50px 30px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8f9fa;
      margin-bottom: 20px;
    }

    .drop-zone:hover {
      border-color: #e94560;
      background: #fff5f7;
    }

    .drop-zone.drag-over {
      border-color: #e94560;
      background: linear-gradient(135deg, #fff5f7 0%, #ffe0e6 100%);
      transform: scale(1.02);
    }

    .drop-zone.has-file {
      border-color: #28a745;
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      border-style: solid;
    }

    .drop-icon {
      font-size: 48px;
      margin-bottom: 15px;
      display: block;
    }

    .drop-text {
      color: #666;
      font-size: 16px;
      margin-bottom: 8px;
    }

    .drop-hint {
      color: #999;
      font-size: 12px;
    }

    .file-name {
      color: #155724;
      font-weight: 600;
      font-size: 16px;
      margin-top: 10px;
      word-break: break-all;
    }

    .file-input {
      display: none;
    }

    .btn {
      width: 100%;
      padding: 18px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(233, 69, 96, 0.4);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
      margin-top: 10px;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e0e0e0;
    }

    .result {
      margin-top: 25px;
      padding: 20px;
      border-radius: 12px;
      display: none;
    }

    .result.success {
      display: block;
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      border: 1px solid #28a745;
    }

    .result.error {
      display: block;
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      border: 1px solid #dc3545;
    }

    .result-title {
      font-weight: 600;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
    }

    .result.success .result-title { color: #155724; }
    .result.error .result-title { color: #721c24; }

    .result-text {
      font-size: 13px;
      word-break: break-all;
      line-height: 1.6;
    }

    .result.success .result-text { color: #155724; }
    .result.error .result-text { color: #721c24; }

    .output-info {
      margin-top: 20px;
      padding: 15px;
      background: #f0f4f8;
      border-radius: 10px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }

    .output-info strong {
      color: #1a1a2e;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .processing {
      animation: pulse 1.5s ease-in-out infinite;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoBase64}" alt="MéTRIK" class="logo">
      <h1>Conversor MD a PDF</h1>
      <p class="subtitle">Arrastra tu archivo Markdown para convertirlo a PDF</p>
    </div>

    <div class="drop-zone" id="dropZone">
      <span class="drop-icon" id="dropIcon">📄</span>
      <p class="drop-text" id="dropText">Arrastra tu archivo .md aquí</p>
      <p class="drop-hint" id="dropHint">o haz clic para seleccionar</p>
      <p class="file-name" id="fileName" style="display: none;"></p>
    </div>

    <input type="file" class="file-input" id="fileInput" accept=".md">

    <button class="btn btn-primary" id="convertBtn" disabled>
      <span id="btnText">Convertir a PDF</span>
      <div class="spinner" id="spinner" style="display: none;"></div>
    </button>

    <button class="btn btn-secondary" id="clearBtn" style="display: none;">
      Limpiar y seleccionar otro archivo
    </button>

    <div class="output-info">
      Los PDFs se guardarán en: <strong>MéTRIK/</strong>
    </div>

    <div id="result" class="result"></div>
  </div>

  <script>
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('spinner');
    const result = document.getElementById('result');
    const dropIcon = document.getElementById('dropIcon');
    const dropText = document.getElementById('dropText');
    const dropHint = document.getElementById('dropHint');
    const fileNameEl = document.getElementById('fileName');

    let selectedFile = null;
    let fileContent = null;

    // Click en drop zone abre selector de archivos
    dropZone.addEventListener('click', () => {
      if (!selectedFile) {
        fileInput.click();
      }
    });

    // Manejar selección de archivo
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    });

    // Drag & Drop events
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    // Procesar archivo
    function handleFile(file) {
      if (!file.name.endsWith('.md')) {
        showError('Por favor selecciona un archivo con extensión .md');
        return;
      }

      selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        fileContent = e.target.result;
        updateUIForFile(file.name);
      };
      reader.onerror = () => {
        showError('Error al leer el archivo');
      };
      reader.readAsText(file);
    }

    // Actualizar UI cuando hay archivo
    function updateUIForFile(name) {
      dropZone.classList.add('has-file');
      dropIcon.textContent = '✅';
      dropText.textContent = 'Archivo listo para convertir';
      dropHint.style.display = 'none';
      fileNameEl.textContent = name;
      fileNameEl.style.display = 'block';
      convertBtn.disabled = false;
      clearBtn.style.display = 'block';
      result.className = 'result';
      result.style.display = 'none';
    }

    // Limpiar selección
    clearBtn.addEventListener('click', () => {
      selectedFile = null;
      fileContent = null;
      fileInput.value = '';

      dropZone.classList.remove('has-file');
      dropIcon.textContent = '📄';
      dropText.textContent = 'Arrastra tu archivo .md aquí';
      dropHint.style.display = 'block';
      fileNameEl.style.display = 'none';
      convertBtn.disabled = true;
      clearBtn.style.display = 'none';
      result.className = 'result';
      result.style.display = 'none';
    });

    // Convertir archivo
    convertBtn.addEventListener('click', async () => {
      if (!selectedFile || !fileContent) return;

      // Estado de carga
      convertBtn.disabled = true;
      btnText.textContent = 'Convirtiendo...';
      spinner.style.display = 'block';
      dropZone.classList.add('processing');

      try {
        const response = await fetch('/api/convert-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: fileContent,
            fileName: selectedFile.name
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          result.className = 'result success';
          result.innerHTML =
            '<div class="result-title">✅ PDF generado exitosamente</div>' +
            '<div class="result-text">' +
              '<strong>Archivo:</strong> ' + data.fileName + '<br>' +
              '<strong>Tamaño:</strong> ' + data.size + '<br>' +
              '<strong>Ubicación:</strong> ' + data.outputPath +
            '</div>';
        } else {
          throw new Error(data.error || 'Error desconocido');
        }
      } catch (error) {
        showError(error.message);
      } finally {
        convertBtn.disabled = false;
        btnText.textContent = 'Convertir a PDF';
        spinner.style.display = 'none';
        dropZone.classList.remove('processing');
      }
    });

    function showError(message) {
      result.className = 'result error';
      result.innerHTML =
        '<div class="result-title">❌ Error</div>' +
        '<div class="result-text">' + message + '</div>';
    }
  </script>
</body>
</html>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         MéTRIK - Conversor MD a PDF                        ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║                                                            ║');
  console.log('║  🚀 Servidor iniciado en: http://localhost:' + PORT + '            ║');
  console.log('║                                                            ║');
  console.log('║  📁 Los PDFs se guardarán en la carpeta MéTRIK             ║');
  console.log('║                                                            ║');
  console.log('║  Presiona Ctrl+C para detener el servidor                  ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
});
