# DESIGN SPECIFICATION - Sistema MéTRIK

**Proyecto:** Sistema de Gestión MéTRIK
**Documento:** Especificación de Diseño y UX
**Versión:** 1.0
**Fecha:** 2 Diciembre 2025

---

## 🎨 DESIGN SYSTEM

### Paleta de Colores

```css
:root {
  /* Colores Principales */
  --color-primary: #1A1A1A;        /* Negro - Textos, headers */
  --color-accent: #10B981;          /* Verde - Botones, éxito */
  --color-secondary: #6B7280;       /* Gris - Textos secundarios */

  /* Estados */
  --color-success: #10B981;         /* Verde - Éxito */
  --color-warning: #F59E0B;         /* Amarillo - Advertencias */
  --color-danger: #EF4444;          /* Rojo - Errores */
  --color-info: #3B82F6;            /* Azul - Información */

  /* Backgrounds */
  --color-bg-primary: #F9FAFB;      /* Fondo principal */
  --color-bg-secondary: #FFFFFF;    /* Cards, modales */
  --color-bg-hover: #F3F4F6;        /* Hover states */

  /* Borders */
  --color-border: #E5E7EB;          /* Bordes sutiles */
  --color-border-dark: #D1D5DB;     /* Bordes más marcados */

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-green: 0 4px 14px 0 rgba(16, 185, 129, 0.25);
}
```

### Tipografía

```css
/* Importar Montserrat */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

:root {
  --font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Tamaños */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;

  /* Weights */
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}

/* Clases de utilidad */
.h1 { font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); }
.h2 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }
.h3 { font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); }
.body { font-size: var(--font-size-base); font-weight: var(--font-weight-normal); }
.small { font-size: var(--font-size-sm); font-weight: var(--font-weight-normal); }
```

### Espaciado

```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
}
```

### Bordes y Radius

```css
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  --border-width: 1px;
  --border-width-thick: 2px;
}
```

---

## 🧱 COMPONENTES UI

### 1. Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">
  Guardar
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  Cancelar
</button>

<!-- Danger Button -->
<button class="btn btn-danger">
  Eliminar
</button>

<!-- Loading State -->
<button class="btn btn-primary" disabled>
  <span class="spinner"></span>
  Guardando...
</button>
```

```css
.btn {
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
  box-shadow: var(--shadow-green);
}

.btn-primary:hover {
  background: #0d9668;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px 0 rgba(16, 185, 129, 0.35);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  background: var(--color-bg-hover);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}
```

### 2. Cards

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título de la Card</h3>
  </div>
  <div class="card-body">
    Contenido de la card
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Acción</button>
  </div>
</div>
```

```css
.card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.card-body {
  padding: var(--spacing-lg);
}

.card-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}
```

### 3. KPI Cards

```html
<div class="kpi-card">
  <div class="kpi-icon">
    📊
  </div>
  <div class="kpi-content">
    <p class="kpi-label">Leads Activos</p>
    <h2 class="kpi-value">24</h2>
    <p class="kpi-change positive">+12% vs mes anterior</p>
  </div>
</div>
```

```css
.kpi-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.kpi-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.kpi-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
}

.kpi-label {
  font-size: var(--font-size-sm);
  color: var(--color-secondary);
  margin: 0 0 4px 0;
}

.kpi-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 4px 0;
}

.kpi-change {
  font-size: var(--font-size-sm);
  margin: 0;
}

.kpi-change.positive {
  color: var(--color-success);
}

.kpi-change.negative {
  color: var(--color-danger);
}
```

### 4. Tables

```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Lead</th>
        <th>Empresa</th>
        <th>Etapa</th>
        <th>Valor</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Juan Pérez</td>
        <td>Tech Solutions</td>
        <td><span class="badge badge-info">Propuesta</span></td>
        <td>$15.000.000</td>
        <td><span class="badge badge-success">Activo</span></td>
        <td>
          <button class="btn-icon">✏️</button>
          <button class="btn-icon">🗑️</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

```css
.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table thead {
  background: var(--color-bg-primary);
  border-bottom: 2px solid var(--color-border);
}

.table th {
  padding: var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-base);
}

.table tbody tr:hover {
  background: var(--color-bg-hover);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  font-size: 18px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}
```

### 5. Badges

```html
<span class="badge badge-success">Activo</span>
<span class="badge badge-warning">Pendiente</span>
<span class="badge badge-danger">Cancelado</span>
<span class="badge badge-info">En proceso</span>
```

```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: #D1FAE5;
  color: #065F46;
}

.badge-warning {
  background: #FEF3C7;
  color: #92400E;
}

.badge-danger {
  background: #FEE2E2;
  color: #991B1B;
}

.badge-info {
  background: #DBEAFE;
  color: #1E40AF;
}

.badge-secondary {
  background: var(--color-bg-hover);
  color: var(--color-secondary);
}
```

### 6. Forms

```html
<form class="form">
  <div class="form-group">
    <label class="form-label" for="lead">Nombre del Lead *</label>
    <input type="text" id="lead" class="form-input" placeholder="Ej: Juan Pérez" required>
    <span class="form-error">Este campo es requerido</span>
  </div>

  <div class="form-group">
    <label class="form-label" for="etapa">Etapa *</label>
    <select id="etapa" class="form-select" required>
      <option value="">Seleccionar...</option>
      <option value="contacto">Contacto</option>
      <option value="propuesta">Propuesta</option>
      <option value="negociacion">Negociación</option>
      <option value="cierre">Cierre</option>
    </select>
  </div>

  <div class="form-group">
    <label class="form-label" for="notas">Notas</label>
    <textarea id="notas" class="form-textarea" rows="4" placeholder="Observaciones adicionales"></textarea>
  </div>

  <div class="form-actions">
    <button type="button" class="btn btn-secondary">Cancelar</button>
    <button type="submit" class="btn btn-primary">Guardar</button>
  </div>
</form>
```

```css
.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: var(--color-danger);
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  display: none;
}

.form-input.error ~ .form-error {
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
}
```

### 7. Modal

```html
<div class="modal" id="myModal">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">Agregar Lead</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <!-- Form aquí -->
    </div>
  </div>
</div>
```

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
}

.modal.active {
  display: flex;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-xl);
}

.modal-close {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: var(--color-secondary);
  line-height: 1;
}

.modal-close:hover {
  color: var(--color-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}
```

### 8. Loading States

```html
<!-- Spinner -->
<div class="spinner"></div>

<!-- Skeleton -->
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-card"></div>
```

```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-hover) 0%,
    var(--color-bg-primary) 50%,
    var(--color-bg-hover) 100%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: 16px;
  width: 100%;
  margin: 8px 0;
}

.skeleton-card {
  height: 200px;
  width: 100%;
}
```

### 9. Toast Notifications

```html
<div class="toast toast-success">
  <span class="toast-icon">✓</span>
  <span class="toast-message">Lead guardado exitosamente</span>
  <button class="toast-close">&times;</button>
</div>
```

```css
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 300px;
  animation: toastSlideIn 0.3s ease;
  z-index: 2000;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-success {
  background: var(--color-success);
  color: white;
}

.toast-error {
  background: var(--color-danger);
  color: white;
}

.toast-warning {
  background: var(--color-warning);
  color: white;
}

.toast-icon {
  font-size: 20px;
  font-weight: bold;
}

.toast-message {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.8;
}

.toast-close:hover {
  opacity: 1;
}
```

---

## 📱 WIREFRAMES

### Vista 1: Dashboard (Landing)

```
┌──────────────────────────────────────────────────────────┐
│  [Logo MéTRIK]               [Usuario ▼] [Logout]        │
├──────────────────────────────────────────────────────────┤
│  Sidebar Nav                  Main Content                │
│  ┌─────────┐                 ┌─────────────────────────┐ │
│  │ 📊 Dash │                 │  DASHBOARD              │ │
│  │ 🎯 Pipe │                 │                         │ │
│  │ 📋 Proy │                 │  ┌─────┐ ┌─────┐       │ │
│  │ 💰 Fact │                 │  │ KPI │ │ KPI │       │ │
│  │ 👥 Cont │                 │  │ 24  │ │ $45M│       │ │
│  │ 🤝 Prom │                 │  └─────┘ └─────┘       │ │
│  │ 💸 Gast │                 │                         │ │
│  └─────────┘                 │  ┌─────────────────┐   │ │
│                               │  │   Gráfica 1     │   │ │
│                               │  │   (Barras)      │   │ │
│                               │  └─────────────────┘   │ │
│                               │                         │ │
│                               │  ┌──────┐ ┌──────────┐ │ │
│                               │  │Donut │ │  Línea   │ │ │
│                               │  │Chart │ │  Chart   │ │ │
│                               │  └──────┘ └──────────┘ │ │
│                               └─────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Vista 2-7: CRUD Views (Ejemplo: Pipeline)

```
┌──────────────────────────────────────────────────────────┐
│  [Logo]                      [Usuario ▼] [Logout]        │
├──────────────────────────────────────────────────────────┤
│  Sidebar    │  PIPELINE                                   │
│             │  ┌───────────────────────────────────────┐  │
│             │  │ [Buscar...]  [Filtro ▼]  [+ Nuevo]   │  │
│             │  └───────────────────────────────────────┘  │
│             │                                             │
│             │  ┌─────────────────────────────────────┐   │
│             │  │ Tabla de Leads                      │   │
│             │  ├─────┬──────┬──────┬──────┬──────────┤   │
│             │  │Lead │Empre │Etapa │Valor │Estado    │   │
│             │  ├─────┼──────┼──────┼──────┼──────────┤   │
│             │  │Juan │Tech  │Prop  │$15M  │[Activo]  │   │
│             │  │     │      │      │      │ ✏️ 🗑️   │   │
│             │  ├─────┼──────┼──────┼──────┼──────────┤   │
│             │  │...  │...   │...   │...   │...       │   │
│             │  └─────┴──────┴──────┴──────┴──────────┘   │
│             │                                             │
│             │  [< Anterior] Página 1 de 5 [Siguiente >]  │
└──────────────────────────────────────────────────────────┘
```

### Modal: Agregar/Editar Lead

```
        ┌─────────────────────────────────┐
        │ Agregar Lead              [✕]  │
        ├─────────────────────────────────┤
        │                                 │
        │ Nombre del Lead *               │
        │ [________________]              │
        │                                 │
        │ Empresa *                       │
        │ [________________]              │
        │                                 │
        │ Email *                         │
        │ [________________]              │
        │                                 │
        │ Etapa *                         │
        │ [Seleccionar... ▼]              │
        │                                 │
        │ Valor *                         │
        │ [________________]              │
        │                                 │
        │ Probabilidad (%) *              │
        │ [________________]              │
        │                                 │
        ├─────────────────────────────────┤
        │         [Cancelar] [Guardar]    │
        └─────────────────────────────────┘
```

---

## 📐 LAYOUT & GRID

### Estructura General

```html
<div class="app">
  <header class="app-header">
    <!-- Logo, User menu -->
  </header>

  <div class="app-container">
    <aside class="app-sidebar">
      <!-- Navigation -->
    </aside>

    <main class="app-main">
      <!-- Vista actual -->
    </main>
  </div>
</div>
```

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
}

.app-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-container {
  display: flex;
  flex: 1;
}

.app-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.app-main {
  flex: 1;
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Grid para Dashboard */
.dashboard-grid {
  display: grid;
  gap: var(--spacing-lg);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

@media (min-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile First */
/* Base: < 640px (mobile) */

@media (min-width: 640px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large Desktop */
}
```

### Mobile Adaptations

```css
@media (max-width: 768px) {
  /* Sidebar → Hamburger menu */
  .app-sidebar {
    position: fixed;
    left: -250px;
    transition: left 0.3s ease;
    z-index: 200;
  }

  .app-sidebar.active {
    left: 0;
  }

  /* Stack KPIs verticalmente */
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  /* Tablas → Scroll horizontal */
  .table-container {
    overflow-x: scroll;
  }

  /* Reducir padding */
  .app-main {
    padding: var(--spacing-md);
  }

  /* Modal → Fullscreen */
  .modal-content {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
}
```

---

## 🎯 INTERACCIONES Y ESTADOS

### Estados de Carga

1. **Initial Load:** Skeleton screens en dashboard
2. **Data Fetching:** Spinner en botones/tablas
3. **Saving:** Botón deshabilitado + texto "Guardando..."
4. **Success:** Toast verde + actualizar tabla
5. **Error:** Toast rojo + mantener formulario

### Validaciones

1. **Real-time:** Validar mientras escribe (debounce 500ms)
2. **On blur:** Validar al salir del campo
3. **On submit:** Validación final antes de enviar

### Feedback Visual

```css
/* Estado de focus */
input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Estado de error */
input.error {
  border-color: var(--color-danger);
}

/* Estado disabled */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Hover effects */
.table tbody tr:hover {
  background: var(--color-bg-hover);
  cursor: pointer;
}
```

---

## 🚀 PRÓXIMOS PASOS

Con esta especificación de diseño, el próximo paso es:

1. ✅ REQUIREMENTS_DOC.md
2. ✅ DATA_SPEC.md
3. ✅ DESIGN_SPEC.md
4. ⏳ PROJECT_STATE.md
5. ⏳ Setup Google Cloud Project
6. ⏳ Implementar estructura HTML base
7. ⏳ Implementar componentes UI
8. ⏳ Integrar Google Sheets API
9. ⏳ Desarrollo de vistas CRUD

---

**Versión:** 1.0
**Estado:** En revisión
**Última actualización:** 2 Diciembre 2025
