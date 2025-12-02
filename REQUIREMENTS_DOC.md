# REQUIREMENTS DOCUMENT - Sistema MéTRIK

**Proyecto:** Sistema de Gestión MéTRIK - Dashboard + CRM Interno
**Cliente:** MéTRIK (Uso interno)
**Fecha:** 2 Diciembre 2025
**Owner:** Mauricio Moreno Guzmán
**Repo:** https://github.com/metrik360/metrik-sistema-dashboard

---

## 🎯 OBJETIVO DEL PROYECTO

Migrar el sistema operativo interno de MéTRIK de Google Apps Script a una aplicación web moderna (HTML/JS puro + Google Sheets API v4), deployable en GitHub Pages con dominio personalizado (metrik.com.co).

### Filosofía
"MéTRIK practica lo que predica" - Este sistema utiliza el mismo stack tecnológico que vendemos a nuestros clientes, convirtiéndose en caso de éxito demostrable y código 100% reutilizable.

---

## 🏢 CONTEXTO DE NEGOCIO

**MéTRIK:** Empresa que vende dashboards operacionales en 10 días.

**Propósito del sistema:**
- CRM comercial (pipeline de leads)
- Gestión de proyectos (operaciones)
- Control financiero (facturación y gastos)
- Base de datos de contactos
- Red de promotores/referidos

**Criterios de éxito:**
1. Funciona 100% sin Apps Script
2. Deployable en GitHub Pages
3. Dominio personalizable (metrik.com.co)
4. KPIs actualizan en tiempo real
5. Gráficas renderean correctamente
6. CRUD completo en las 6 hojas principales
7. Código vendible/reutilizable para clientes
8. Mismo design system que proyectos clientes

---

## 📊 STACK TECNOLÓGICO

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos base
- **Tailwind CSS** - Framework de utilidades (vía CDN)
- **JavaScript vanilla** - Lógica e interactividad (NO frameworks)

### Librerías
- **Chart.js 4.4.0** - Visualización de datos
- **Google Fonts** - Montserrat (400, 600, 700)

### Backend/Datos
- **Google Sheets API v4** - Base de datos
- **OAuth 2.0** - Autenticación

### Deploy
- **GitHub Pages** - Hosting
- **Custom domain** - metrik.com.co

---

## 🗄️ FUENTE DE DATOS

**Tipo:** Google Sheets
**Sheet ID:** [PENDING - Mauricio lo proporcionará]

### Estructura de Hojas

| Hoja | Propósito | Campos Principales |
|------|-----------|-------------------|
| **Pipeline** | CRM comercial | Lead, Empresa, Etapa, Valor, Probabilidad, Fecha contacto, Estado |
| **Proyectos** | Gestión operativa | Nombre, Cliente, Estado, Fase, Fecha inicio, Fecha entrega, Valor |
| **Facturación** | Ingresos | Proyecto, Cliente, Monto, Fecha emisión, Fecha pago, Estado, Método pago |
| **Contactos** | Base datos | Nombre, Email, Teléfono, Empresa, Cargo, Tipo, Fuente |
| **Promotores** | Red referidos | Nombre, Email, Teléfono, Referidos (#), Comisión acumulada, Estado |
| **Gastos** | Egresos | Fecha, Concepto, Categoría, Monto, Método pago, Proveedor, Estado |

---

## 🎨 DESIGN SYSTEM MÉTRIK

### Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| **Negro** | #1A1A1A | Primario (textos, backgrounds) |
| **Verde** | #10B981 | Acento/Éxito (botones, badges positivos) |
| **Gris** | #6B7280 | Secundario (textos suaves, borders) |
| **Rojo** | #EF4444 | Alertas/Errores |
| **Amarillo** | #F59E0B | Warnings/Pendientes |
| **Fondo** | #F9FAFB | Background general |

### Tipografía
- **Familia:** Montserrat (Google Fonts)
- **Weights:** 400 (regular), 600 (semi-bold), 700 (bold)
- **Tamaños:**
  - H1: 32px / 700
  - H2: 24px / 600
  - H3: 20px / 600
  - Body: 16px / 400
  - Small: 14px / 400

### Componentes

**Cards:**
- Border-radius: 12px
- Padding: 24px
- Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
- Background: white

**Buttons:**
- Primary: Verde con sombra verde suave
- Secondary: Gris con hover
- Border-radius: 8px
- Padding: 12px 24px

**Tables:**
- Hover states en filas
- Zebra striping opcional
- Headers con background gris claro

**Badges:**
- Border-radius: 16px
- Padding: 4px 12px
- Colores según estado:
  - Activo/Ganado: Verde
  - Pendiente: Amarillo
  - Perdido/Cancelado: Rojo
  - En proceso: Gris

**Loading States:**
- Spinner con color verde
- Skeleton screens para tablas

---

## 🚀 FUNCIONALIDADES CORE

### VISTA 1: Dashboard (Landing Page)

**KPIs Principales:**
1. **Leads Activos** - Count de Pipeline donde Estado = "Activo"
2. **Pipeline Value** - Suma de Valor × Probabilidad en Pipeline
3. **Proyectos Activos** - Count de Proyectos donde Estado = "Activo"
4. **Facturación Mes Actual** - Suma de Monto en Facturación del mes

**Gráficas:**
1. **Pipeline por Etapa** (Barras horizontales)
   - Eje X: Cantidad de leads
   - Eje Y: Etapa (Contacto, Propuesta, Negociación, Cierre)
   - Color: Verde

2. **Proyectos por Estado** (Donut)
   - Segmentos: Activo, Pausado, Completado, Cancelado
   - Colores: Verde, Amarillo, Gris, Rojo

3. **Facturación últimos 12 meses** (Línea)
   - Eje X: Meses
   - Eje Y: Monto ($)
   - Línea: Verde con gradiente

### VISTAS 2-7: CRUD Completo

**Funcionalidades por vista:**

1. **Formulario de captura**
   - Validaciones frontend (campos requeridos)
   - Dropdowns dinámicos interconectados
   - Anti-doble-click en botón guardar
   - Mensajes de éxito/error

2. **Tabla de visualización**
   - Ordenamiento por columnas
   - Búsqueda/filtrado
   - Paginación (opcional)
   - Edición inline o modal
   - Eliminación con confirmación

3. **Integraciones entre vistas**
   - Dropdown "Cliente" en Proyectos → Trae de Contactos
   - Dropdown "Proyecto" en Facturación → Trae de Proyectos
   - Autocompletar emails existentes

---

## 🔒 RESTRICCIONES TÉCNICAS

### 1. Seguridad OAuth
- **Client ID** almacenado en frontend
- **Scopes necesarios:**
  - `https://www.googleapis.com/auth/spreadsheets`
- **Flujo:** OAuth 2.0 implicit flow
- **Token refresh:** Manejar expiración automáticamente
- **Server-side signing:** Opcional (evaluar en fase de desarrollo)

### 2. Anti-doble-click
```javascript
// Deshabilitar botón durante guardado
button.disabled = true;
button.textContent = "Guardando...";
// Reactivar después de respuesta API
```

### 3. Rate Limits Google Sheets API
- **Límite:** 100 requests/100 segundos/usuario
- **Estrategia:**
  - Batch updates donde sea posible
  - Throttling con cola de peticiones
  - Mostrar loading states
  - Cachear datos leídos (5 min)

### 4. Performance
- **Carga inicial:** < 3 segundos
- **Cambio de vista:** < 500ms
- **Guardado de datos:** < 2 segundos
- **Renderizado gráficas:** < 1 segundo

### 5. Responsive Design
- **Mobile-first approach**
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Tablas colapsables en mobile
- Navegación hamburger menu

---

## 📦 ENTREGABLES

### Código
1. **`index.html`** - Aplicación completa SPA
2. **`styles.css`** (opcional) - Estilos custom adicionales
3. **`app.js`** (opcional) - Lógica separada si index.html crece mucho
4. **`.gitignore`** - Excluir archivos innecesarios
5. **`CNAME`** - Para dominio custom metrik.com.co

### Documentación
1. **`README.md`** - Setup completo del proyecto
   - Requisitos previos
   - Instrucciones OAuth setup (Google Cloud Console)
   - Configuración Sheet ID
   - Deploy a GitHub Pages
   - Conectar dominio personalizado

2. **`USER_GUIDE.md`** - Guía de uso del sistema
   - Login y autenticación
   - Navegación por vistas
   - Crear/editar/eliminar registros
   - Interpretar KPIs y gráficas

3. **`DEPLOY_GUIDE.md`** - Instrucciones de deployment
   - GitHub Pages setup
   - DNS configuration para metrik.com.co
   - SSL/HTTPS configuration
   - Troubleshooting común

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Funcionales
- [ ] Sistema funciona sin Google Apps Script
- [ ] Autenticación OAuth 2.0 exitosa
- [ ] Lectura de datos desde Google Sheets
- [ ] Escritura/actualización de datos en Google Sheets
- [ ] 4 KPIs calculan correctamente en Dashboard
- [ ] 3 gráficas renderizan con datos reales
- [ ] CRUD completo en las 6 hojas
- [ ] Validaciones de formularios funcionan
- [ ] Anti-doble-click implementado
- [ ] Dropdowns dinámicos interconectados

### No Funcionales
- [ ] Carga inicial < 3s
- [ ] Cambio de vista < 500ms
- [ ] Responsive en mobile, tablet, desktop
- [ ] Design system aplicado consistentemente
- [ ] Código limpio y comentado
- [ ] README con setup completo

### Deploy
- [ ] Deployado en GitHub Pages
- [ ] Dominio metrik.com.co conectado
- [ ] HTTPS habilitado
- [ ] Accesible desde cualquier dispositivo

### Reutilización
- [ ] Código vendible a clientes
- [ ] Fácil de replicar para otros proyectos
- [ ] Documentación suficiente para handoff

---

## 📅 FASES DEL PROYECTO

### Fase 1: Discovery ✅
- Documento de requirements (este archivo)
- Especificación de datos (DATA_SPEC.md)
- Especificación de diseño (DESIGN_SPEC.md)

### Fase 2: Setup & Auth (Día 1)
- Setup Google Cloud Project
- Configurar OAuth 2.0
- Crear cliente OAuth (Client ID)
- Probar autenticación básica

### Fase 3: Data Layer (Día 1-2)
- Implementar conexión Google Sheets API
- Funciones CRUD base (read, write, update, delete)
- Manejo de rate limits
- Cacheo de datos

### Fase 4: Dashboard View (Día 2-3)
- Layout y estructura
- Cálculo de 4 KPIs
- Implementación de 3 gráficas (Chart.js)
- Responsive design

### Fase 5: CRUD Views (Día 3-5)
- Vista Pipeline (CRM)
- Vista Proyectos
- Vista Facturación
- Vista Contactos
- Vista Promotores
- Vista Gastos
- Formularios + Tablas + Validaciones

### Fase 6: Integraciones (Día 5)
- Dropdowns interconectados
- Autocompletar
- Flujos entre vistas

### Fase 7: Polish & Testing (Día 6)
- Refinamiento de UI/UX
- Testing en diferentes dispositivos
- Optimización de performance
- Bug fixes

### Fase 8: Deploy & Documentación (Día 7)
- Deploy a GitHub Pages
- Configurar dominio metrik.com.co
- Completar documentación
- Capacitación/handoff

---

## 🚨 RIESGOS Y MITIGACIONES

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Rate limits de Google Sheets API | Alto | Media | Implementar throttling y cacheo |
| Complejidad de OAuth | Alto | Baja | Usar librerías probadas (gapi.js) |
| Performance con muchos datos | Medio | Media | Paginación y carga lazy |
| Compatibilidad mobile | Medio | Baja | Testing temprano en dispositivos |
| Dominio personalizado DNS | Bajo | Baja | Seguir guía oficial GitHub Pages |

---

## 📞 CONTACTO Y APROBACIONES

**Owner:** Mauricio Moreno Guzmán
**Email:** [Agregar email]
**Aprobación de requirements:** [Pendiente]

---

## 📝 PRÓXIMOS PASOS

1. ✅ Crear repositorio GitHub
2. ✅ Generar REQUIREMENTS_DOC.md
3. ⏳ Crear DATA_SPEC.md (especificación detallada de campos)
4. ⏳ Crear DESIGN_SPEC.md (wireframes y componentes)
5. ⏳ Setup Google Cloud Project y OAuth
6. ⏳ Comenzar desarrollo

---

**Versión:** 1.0
**Última actualización:** 2 Diciembre 2025
**Estado:** En revisión
