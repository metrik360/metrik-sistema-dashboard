# DATA SPECIFICATION - Sistema MéTRIK

**Proyecto:** Sistema de Gestión MéTRIK
**Documento:** Especificación de Estructura de Datos
**Versión:** 1.0
**Fecha:** 2 Diciembre 2025

---

## 📋 OVERVIEW

Este documento especifica la estructura detallada de las 7 hojas de Google Sheets que conforman la base de datos del sistema MéTRIK.

**Hojas:**
1. Pipeline (CRM Comercial)
2. Proyectos (Gestión Operativa)
3. Facturación (Control Financiero)
4. Contactos (Base de Datos)
5. Promotores (Red de Referidos)
6. Servicios (Portafolio / Catálogo) ⭐ NUEVO
7. Gastos (Control de Egresos)

**Google Sheet ID:** `[PENDING - Mauricio lo proporcionará]`

---

## 🗂️ HOJA 1: PIPELINE (CRM Comercial)

**Propósito:** Gestión del embudo de ventas y leads comerciales

### Estructura de Columnas

| # | Campo | Tipo | Requerido | Validaciones | Valores Permitidos | Descripción |
|---|-------|------|-----------|--------------|-------------------|-------------|
| A | **ID** | Texto | Sí | Único, auto-generado | `PIP-YYYY-####` | Identificador único del lead |
| B | **Lead** | Texto | Sí | Min 3 caracteres | - | Nombre de la persona de contacto |
| C | **Empresa** | Texto | Sí | Min 2 caracteres | - | Nombre de la empresa |
| D | **Email** | Email | Sí | Formato email válido | - | Email de contacto |
| E | **Teléfono** | Texto | No | Formato: +57 ### ### #### | - | Teléfono de contacto |
| F | **Etapa** | Dropdown | Sí | - | Contacto, Propuesta, Negociación, Cierre | Etapa actual en el pipeline |
| G | **Valor** | Número | Sí | > 0 | - | Valor potencial del proyecto (COP) |
| H | **Probabilidad** | Número | Sí | 0-100 | - | % de probabilidad de cierre |
| I | **Fecha Contacto** | Fecha | Sí | Formato: YYYY-MM-DD | - | Fecha del primer contacto |
| J | **Fecha Estimada Cierre** | Fecha | No | >= Fecha Contacto | - | Fecha esperada de cierre |
| K | **Estado** | Dropdown | Sí | - | Activo, Ganado, Perdido, Pausado | Estado actual del lead |
| L | **Fuente** | Dropdown | No | - | Web, Referido, LinkedIn, Evento, Otro | Origen del lead |
| M | **Notas** | Texto largo | No | - | - | Observaciones adicionales |
| N | **Servicio** | Dropdown | No | Debe existir en Servicios | - | Servicio solicitado (auto-completa Valor) |
| O | **Fecha Actualización** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Última modificación (auto) |

### Reglas de Negocio

1. **Pipeline Value = Valor × (Probabilidad / 100)**
2. **Probabilidad por etapa (sugerida):**
   - Contacto: 25%
   - Propuesta: 50%
   - Negociación: 75%
   - Cierre: 90%
3. **Estado "Ganado"** → Debe crear registro automático en Proyectos
4. **Leads Activos** = Estado != "Ganado" && Estado != "Perdido"

### Ejemplos de Datos

```
PIP-2025-0001 | Juan Pérez | Tech Solutions | juan@tech.co | +57 300 123 4567 | Propuesta | 15000000 | 50 | 2025-11-15 | 2025-12-30 | Activo | LinkedIn | Interesado en dashboard de ventas | 2025-11-20 10:30
```

---

## 🗂️ HOJA 2: PROYECTOS (Gestión Operativa)

**Propósito:** Control de proyectos en ejecución y completados

### Estructura de Columnas

| # | Campo | Tipo | Requerido | Validaciones | Valores Permitidos | Descripción |
|---|-------|------|-----------|--------------|-------------------|-------------|
| A | **ID** | Texto | Sí | Único, auto-generado | `PRJ-YYYY-####` | Identificador único del proyecto |
| B | **Nombre** | Texto | Sí | Min 5 caracteres | - | Nombre del proyecto |
| C | **Cliente** | Dropdown | Sí | Debe existir en Contactos | - | Nombre del cliente |
| D | **Email Cliente** | Email | Auto | Trae de Contactos | - | Email del cliente (auto-populate) |
| E | **Tipo Proyecto** | Dropdown | Sí | - | Dashboard, CRM, Landing, Custom | Tipo de entregable |
| F | **Estado** | Dropdown | Sí | - | Activo, Pausado, Completado, Cancelado | Estado actual |
| G | **Fase** | Dropdown | Sí | - | Discovery, Design, Desarrollo, QA, Deploy, Cerrado | Fase actual del proyecto |
| H | **Fecha Inicio** | Fecha | Sí | Formato: YYYY-MM-DD | - | Fecha de inicio del proyecto |
| I | **Fecha Entrega Estimada** | Fecha | Sí | >= Fecha Inicio | - | Fecha comprometida de entrega |
| J | **Fecha Entrega Real** | Fecha | No | >= Fecha Inicio | - | Fecha real de entrega |
| K | **Valor** | Número | Sí | > 0 | - | Valor del proyecto (COP) |
| L | **Progreso** | Número | Sí | 0-100 | - | % de avance del proyecto |
| M | **Repositorio** | URL | No | Formato URL válido | - | Link al repo GitHub |
| N | **Deploy URL** | URL | No | Formato URL válido | - | URL del proyecto en producción |
| O | **Notas** | Texto largo | No | - | - | Observaciones |
| P | **Fecha Actualización** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Última modificación |

### Reglas de Negocio

1. **Progreso por fase (estimado):**
   - Discovery: 10%
   - Design: 30%
   - Desarrollo: 70%
   - QA: 85%
   - Deploy: 95%
   - Cerrado: 100%

2. **Estado vs Fase:**
   - Completado → Fase debe ser "Cerrado" y Progreso = 100%
   - Cancelado → Progreso se congela

3. **Días transcurridos** = Hoy - Fecha Inicio
4. **Días restantes** = Fecha Entrega Estimada - Hoy
5. **Alerta si:** Días restantes < 2 y Progreso < 80%

### Ejemplos de Datos

```
PRJ-2025-0001 | Dashboard Ventas Tech Solutions | Tech Solutions | juan@tech.co | Dashboard | Activo | Desarrollo | 2025-11-20 | 2025-12-05 | - | 15000000 | 60 | github.com/metrik/tech-dashboard | - | En desarrollo según cronograma | 2025-11-28 14:20
```

---

## 🗂️ HOJA 3: FACTURACIÓN (Control Financiero)

**Propósito:** Gestión de facturas emitidas e ingresos

### Estructura de Columnas

| # | Campo | Tipo | Requerido | Validaciones | Valores Permitidos | Descripción |
|---|-------|------|-----------|--------------|-------------------|-------------|
| A | **ID** | Texto | Sí | Único, auto-generado | `FAC-YYYY-####` | Número de factura |
| B | **Proyecto** | Dropdown | Sí | Debe existir en Proyectos | - | Proyecto asociado |
| C | **Cliente** | Texto | Auto | Trae de Proyectos | - | Cliente (auto-populate) |
| D | **Monto** | Número | Sí | > 0 | - | Monto a facturar (COP) |
| E | **IVA** | Número | No | 0 o 19 | - | % de IVA aplicado |
| F | **Monto Total** | Número | Auto | Monto + (Monto × IVA/100) | - | Total con IVA |
| G | **Fecha Emisión** | Fecha | Sí | Formato: YYYY-MM-DD | - | Fecha de emisión |
| H | **Fecha Vencimiento** | Fecha | Sí | >= Fecha Emisión | - | Fecha límite de pago |
| I | **Fecha Pago** | Fecha | No | - | - | Fecha en que se recibió el pago |
| J | **Estado** | Dropdown | Sí | - | Pendiente, Pagada, Vencida, Cancelada | Estado de la factura |
| K | **Método Pago** | Dropdown | No | - | Transferencia, Efectivo, Tarjeta, Otro | Forma de pago |
| L | **Referencia Pago** | Texto | No | - | - | Número de transacción/referencia |
| M | **Notas** | Texto largo | No | - | - | Observaciones |
| N | **Tipo Factura** | Dropdown | Sí | - | Anticipo 50%, Saldo 50%, Única 100%, Personalizada | Tipo de factura para flujo de caja |
| O | **% Proyecto** | Número | Sí | 0-100 | - | Porcentaje del proyecto que representa esta factura |
| P | **Fecha Actualización** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Última modificación |

### Reglas de Negocio

1. **Monto Total = Monto + (Monto × IVA / 100)**
2. **Estado automático:**
   - Vencida: Si Fecha Vencimiento < Hoy && Estado = "Pendiente"
   - Pagada: Solo si Fecha Pago está llena

3. **Días vencimiento** = Hoy - Fecha Vencimiento (si > 0 y Pendiente → Vencida)
4. **Facturación mes actual** = SUM(Monto Total) WHERE Fecha Pago = mes actual
5. **Alerta si:** Estado = "Vencida" y Días vencimiento > 15

### Flujo de Facturación 50-50 (Anticipo/Saldo)

6. **Workflow Automático Lead → Proyecto → Facturación:**
   - Cuando un Lead se marca como "Ganado" en Pipeline:
     - Sistema pregunta si crear proyecto automáticamente
     - Se crea proyecto con datos del lead (Cliente, Email, Valor)
     - Proyecto inicia en fase "Discovery" con 10% progreso
     - Sistema pregunta si generar factura de anticipo (50%)
     - Se crea factura tipo "Anticipo 50%" por el 50% del valor

7. **Generación de Factura de Anticipo:**
   - Tipo Factura: "Anticipo 50%"
   - Monto: Valor Proyecto × 0.5
   - % Proyecto: 50
   - Vencimiento: Fecha Emisión + 15 días
   - Estado: Pendiente
   - Validación: No puede haber duplicado de anticipo para mismo proyecto

8. **Generación de Factura de Saldo:**
   - Disponible solo cuando Progreso Proyecto >= 90%
   - Tipo Factura: "Saldo 50%"
   - Monto: Valor Proyecto × 0.5
   - % Proyecto: 50
   - Vencimiento: Fecha Emisión + 15 días
   - Estado: Pendiente
   - Validaciones:
     - Debe existir factura de anticipo primero
     - No puede haber duplicado de saldo para mismo proyecto
     - Progreso debe ser >= 90%

9. **Validación de % Total Facturado:**
   - SUM(% Proyecto) por proyecto no puede exceder 100%
   - Al crear/editar factura, sistema valida total acumulado
   - Si supera 100%, muestra error y bloquea guardado

10. **KPIs de Flujo de Caja:**
    - **Facturado Este Mes:** SUM(Monto Total) WHERE Estado = "Pagada" AND Fecha Pago = mes actual
    - **Por Cobrar:** SUM(Monto Total) WHERE Estado = "Pendiente"
    - **Proyectado 30 Días:** SUM(Monto Total) WHERE Estado = "Pendiente" AND Fecha Vencimiento entre Hoy y +30 días
    - **Anticipos sin Saldo:** COUNT(Proyectos) con factura "Anticipo 50%" pero sin "Saldo 50%"

### Ejemplos de Datos

```
# Factura Anticipo (50%)
FAC-2025-0001 | Dashboard Ventas Tech Solutions | Tech Solutions | 7500000 | 19 | 8925000 | 2025-12-01 | 2025-12-16 | - | Pendiente | - | - | Factura de anticipo (50%) generada automáticamente | Anticipo 50% | 50 | 2025-12-01 09:00

# Factura Saldo (50%)
FAC-2025-0002 | Dashboard Ventas Tech Solutions | Tech Solutions | 7500000 | 19 | 8925000 | 2025-12-20 | 2026-01-04 | - | Pendiente | - | - | Factura de saldo (50%) generada al completar proyecto | Saldo 50% | 50 | 2025-12-20 14:30
```

---

## 🗂️ HOJA 4: CONTACTOS (Base de Datos)

**Propósito:** Registro de todos los contactos y clientes

### Estructura de Columnas

| # | Campo | Tipo | Requerido | Validaciones | Valores Permitidos | Descripción |
|---|-------|------|-----------|--------------|-------------------|-------------|
| A | **ID** | Texto | Sí | Único, auto-generado | `CON-YYYY-####` | Identificador único |
| B | **Nombre** | Texto | Sí | Min 3 caracteres | - | Nombre completo |
| C | **Email** | Email | Sí | Formato email válido, único | - | Email principal |
| D | **Teléfono** | Texto | No | Formato: +57 ### ### #### | - | Teléfono |
| E | **Empresa** | Texto | Sí | Min 2 caracteres | - | Empresa donde trabaja |
| F | **Cargo** | Texto | No | - | - | Puesto/cargo |
| G | **Tipo** | Dropdown | Sí | - | Cliente, Lead, Promotor, Proveedor, Otro | Tipo de contacto |
| H | **Fuente** | Dropdown | No | - | Web, Referido, LinkedIn, Evento, Otro | Cómo llegó |
| I | **LinkedIn** | URL | No | Formato URL | - | Perfil de LinkedIn |
| J | **Ciudad** | Texto | No | - | - | Ciudad de residencia |
| K | **País** | Texto | No | - | - | País |
| L | **Tags** | Texto | No | Separados por comas | - | Etiquetas (ej: "tecnología, fintech") |
| M | **Notas** | Texto largo | No | - | - | Observaciones |
| N | **Fecha Creación** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Fecha de registro |
| O | **Fecha Actualización** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Última modificación |

### Reglas de Negocio

1. **Email único** - No puede haber dos contactos con mismo email
2. **Cuando se crea Lead en Pipeline** → Crear contacto automático si no existe
3. **Cuando se crea Proyecto** → Cliente debe existir en Contactos
4. **Tipo "Cliente"** = Ha tenido al menos 1 proyecto completado
5. **Tags para búsqueda** - Implementar autocomplete

### Ejemplos de Datos

```
CON-2025-0001 | Juan Pérez | juan@tech.co | +57 300 123 4567 | Tech Solutions | CTO | Cliente | LinkedIn | linkedin.com/in/juanperez | Bogotá | Colombia | tecnología, software, saas | Contacto clave en Tech Solutions | 2025-11-15 10:00 | 2025-11-20 14:30
```

---

## 🗂️ HOJA 5: PROMOTORES (Red de Referidos)

**Propósito:** Gestión de la red de promotores y comisiones

### Estructura de Columnas

| # | Campo | Tipo | Requerido | Validaciones | Valores Permitidos | Descripción |
|---|-------|------|-----------|--------------|-------------------|-------------|
| A | **ID** | Texto | Sí | Único, auto-generado | `PROM-YYYY-####` | Identificador único |
| B | **Nombre** | Texto | Sí | Min 3 caracteres | - | Nombre del promotor |
| C | **Email** | Email | Sí | Formato email válido, único | - | Email del promotor |
| D | **Teléfono** | Texto | No | Formato: +57 ### ### #### | - | Teléfono |
| E | **Tipo** | Dropdown | Sí | - | Activo, Inactivo, Suspendido | Estado del promotor |
| F | **% Comisión** | Número | Sí | 0-30 | - | Porcentaje de comisión acordado |
| G | **Referidos Totales** | Número | Auto | Count de leads | - | Cantidad de leads referidos |
| H | **Proyectos Ganados** | Número | Auto | Count de proyectos cerrados | - | Leads que se convirtieron |
| I | **Tasa Conversión** | Número | Auto | (Ganados/Totales) × 100 | - | % de efectividad |
| J | **Comisión Generada** | Número | Auto | SUM de comisiones | - | Total de comisiones (COP) |
| K | **Comisión Pagada** | Número | Sí | <= Comisión Generada | - | Total ya pagado (COP) |
| L | **Comisión Pendiente** | Número | Auto | Generada - Pagada | - | Saldo pendiente (COP) |
| M | **Banco** | Texto | No | - | - | Banco para pagos |
| N | **Cuenta** | Texto | No | - | - | Número de cuenta |
| O | **Notas** | Texto largo | No | - | - | Observaciones |
| P | **Fecha Creación** | Fecha | Auto | Formato: YYYY-MM-DD | - | Fecha de registro |
| Q | **Fecha Actualización** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Última modificación |

### Reglas de Negocio

1. **Comisión Generada** = SUM(Valor Proyecto × % Comisión) de proyectos cerrados
2. **Comisión Pendiente** = Comisión Generada - Comisión Pagada
3. **Tasa Conversión** = (Proyectos Ganados / Referidos Totales) × 100
4. **Alerta si:** Comisión Pendiente > $2,000,000 COP
5. **Top Promotor** = Mayor Comisión Generada

### Ejemplos de Datos

```
PROM-2025-0001 | María Gómez | maria@example.com | +57 310 987 6543 | Activo | 10 | 5 | 3 | 60 | 4500000 | 2000000 | 2500000 | Bancolombia | 1234567890 | Promotora desde noviembre | 2025-11-01 | 2025-11-28 16:00
```

---

## 🗂️ HOJA 6: SERVICIOS (Portafolio / Catálogo)

**Propósito:** Catálogo de servicios ofrecidos por MéTRIK con precios y características

### Estructura de Columnas

| # | Campo | Tipo | Requerido | Validaciones | Valores Permitidos | Descripción |
|---|-------|------|-----------|--------------|-------------------|-------------|
| A | **ID** | Texto | Sí | Único, auto-generado | `SRV-YYYY-####` | Identificador único del servicio |
| B | **Nombre Servicio** | Texto | Sí | Min 5 caracteres | - | Nombre del servicio ofrecido |
| C | **Categoría** | Dropdown | Sí | - | Adquisición, Escalada, Retención | Tipo de servicio según etapa del cliente |
| D | **Descripción Corta** | Texto | Sí | Max 200 caracteres | - | Resumen del servicio |
| E | **Descripción Detallada** | Texto largo | No | - | - | Descripción completa del alcance |
| F | **Precio Base** | Número | Sí | >= 0 | - | Precio estándar del servicio (COP) |
| G | **Precio Mínimo** | Número | No | >= 0, <= Precio Base | - | Precio mínimo negociable (COP) |
| H | **Precio Máximo** | Número | No | >= Precio Base | - | Precio máximo por personalizaciones (COP) |
| I | **Duración Estimada** | Número | Sí | > 0 | - | Días estimados de entrega |
| J | **Entregables** | Texto largo | No | - | - | Lista de entregables (separados por línea) |
| K | **Stack Tecnológico** | Texto | No | Separados por comas | - | Tecnologías usadas (ej: HTML, JS, Google Sheets API) |
| L | **Requisitos Cliente** | Texto largo | No | - | - | Lo que el cliente debe proporcionar |
| M | **Estado** | Dropdown | Sí | - | Activo, Descontinuado, Beta, Próximamente | Disponibilidad del servicio |
| N | **Incluye Soporte** | Checkbox | No | Sí/No | - | Si incluye mantenimiento post-entrega |
| O | **Meses Soporte** | Número | No | 0-12 | - | Meses de soporte incluidos |
| P | **Notas Internas** | Texto largo | No | - | - | Notas para equipo MéTRIK |
| Q | **Fecha Creación** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Fecha de creación del servicio |
| R | **Fecha Actualización** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Última modificación |

### Reglas de Negocio

1. **Rango de Precios:**
   - Precio Mínimo <= Precio Base <= Precio Máximo
   - Si no hay rango, usar solo Precio Base

2. **Duración Total = Duración Estimada + Buffer 20%**
   - Para compromiso con cliente: Duración × 1.2

3. **Estado del Servicio:**
   - **Activo**: Disponible para vender
   - **Beta**: Disponible pero en fase de prueba (advertir al cliente)
   - **Próximamente**: Visible pero no vendible aún
   - **Descontinuado**: No mostrar en dropdowns de Pipeline/Proyectos

4. **Vinculación con Pipeline:**
   - Al crear Lead, dropdown "Servicio" carga servicios con Estado = "Activo"
   - Al seleccionar servicio, campo "Valor" se auto-completa con Precio Base
   - Usuario puede ajustar valor entre Precio Mínimo y Precio Máximo

5. **Vinculación con Proyectos:**
   - Al crear Proyecto desde Lead, se copia el Servicio seleccionado
   - Duración Estimada se usa para calcular Fecha Entrega Estimada

6. **Métricas de Servicios:**
   - **Servicio más vendido** = COUNT(Proyectos) GROUP BY Servicio
   - **Ingreso por servicio** = SUM(Valor Proyecto) GROUP BY Servicio
   - **Margen promedio** = AVG((Valor - Precio Mínimo) / Valor) × 100

### Ejemplos de Datos

```
SRV-2025-0001 | Dashboard Interactivo Google Sheets | Dashboard | Dashboard web conectado a Google Sheets con gráficas en tiempo real | Sistema completo de visualización de datos con autenticación OAuth 2.0, KPIs dinámicos, gráficas interactivas y diseño responsive | 15000000 | 12000000 | 20000000 | 30 | - Código fuente completo\n- Deploy en Vercel/Netlify\n- Documentación técnica\n- 2 sesiones de capacitación | HTML, CSS, JavaScript, Google Sheets API v4, Chart.js, OAuth 2.0 | - Acceso a Google Sheet\n- Credenciales OAuth\n- Logo y colores de marca | Activo | Sí | 3 | Alta demanda, personalizable | 2025-11-01 09:00 | 2025-12-02 10:30

SRV-2025-0002 | CRM Completo | CRM | Sistema de gestión de clientes y ventas con pipeline | CRM completo con gestión de leads, pipeline de ventas, seguimiento de proyectos, facturación y reportes | 25000000 | 20000000 | 35000000 | 45 | - Sistema web completo\n- Base de datos\n- Panel de administración\n- Módulo de reportes\n- Capacitación 4 horas | React, Node.js, PostgreSQL, API REST | - Procesos de negocio actuales\n- Logo y marca\n- Hosting para BD | Activo | Sí | 6 | Proyecto complejo, requiere Discovery | 2025-11-01 09:00 | 2025-12-02 10:30

SRV-2025-0003 | Landing Page Conversión | Landing | Página de aterrizaje optimizada para conversión | Landing page profesional con diseño UX/UI optimizado, formularios de contacto, integración con CRM/Email y analytics | 5000000 | 4000000 | 8000000 | 10 | - Diseño responsive\n- Formulario integrado\n- Google Analytics\n- Deploy | HTML, CSS, JavaScript, Tailwind CSS | - Textos y contenido\n- Imágenes y logo\n- Objetivo de conversión | Activo | No | 0 | Entrega rápida | 2025-11-01 09:00 | 2025-12-02 10:30

SRV-2025-0004 | Consultoría Técnica | Consultoría | Asesoría técnica para proyectos web y automatización | Sesiones de consultoría para definición de arquitectura, stack tecnológico, automatizaciones y mejores prácticas | 2000000 | 1500000 | 5000000 | 5 | - Documento de recomendaciones\n- Diagrama de arquitectura\n- Roadmap técnico | - | - Descripción del proyecto\n- Objetivos de negocio | Activo | No | 0 | Por sesiones de 2 horas | 2025-11-15 14:00 | 2025-12-02 10:30
```

### Integración con Otras Hojas

**Pipeline → Servicios:**
- Campo "Servicio" en Pipeline es dropdown que carga de esta hoja
- Al seleccionar servicio, auto-completa campo "Valor" con Precio Base
- Usuario puede ajustar valor dentro del rango permitido

**Proyectos → Servicios:**
- Al crear proyecto desde lead ganado, copia el servicio seleccionado
- Campo "Tipo Proyecto" se llena con Categoría del servicio
- Duración Estimada se usa para calcular fecha de entrega

**Facturación → Servicios:**
- Al facturar, se puede ver qué servicio se vendió
- Permite análisis de rentabilidad por tipo de servicio

---

## 🗂️ HOJA 7: GASTOS (Control de Egresos)

**Propósito:** Registro de gastos operativos y administrativos

### Estructura de Columnas

| # | Campo | Tipo | Requerido | Validaciones | Valores Permitidos | Descripción |
|---|-------|------|-----------|--------------|-------------------|-------------|
| A | **ID** | Texto | Sí | Único, auto-generado | `GAS-YYYY-####` | Identificador único |
| B | **Fecha** | Fecha | Sí | Formato: YYYY-MM-DD | - | Fecha del gasto |
| C | **Concepto** | Texto | Sí | Min 5 caracteres | - | Descripción del gasto |
| D | **Categoría** | Dropdown | Sí | - | Marketing, Software, Oficina, Transporte, Comisiones, Otro | Tipo de gasto |
| E | **Monto** | Número | Sí | > 0 | - | Monto del gasto (COP) |
| F | **Método Pago** | Dropdown | Sí | - | Tarjeta, Transferencia, Efectivo, Otro | Forma de pago |
| G | **Proveedor** | Texto | No | - | - | Empresa/persona que recibe el pago |
| H | **Proyecto Asociado** | Dropdown | No | Debe existir en Proyectos | - | Si aplica a un proyecto específico |
| I | **Estado** | Dropdown | Sí | - | Pagado, Pendiente, Reembolsado | Estado del gasto |
| J | **Factura/Recibo** | URL | No | Formato URL | - | Link a documento (Drive, etc.) |
| K | **Es Recurrente** | Checkbox | No | Sí/No | - | Si es gasto mensual |
| L | **Notas** | Texto largo | No | - | - | Observaciones |
| M | **Fecha Registro** | Fecha | Auto | Formato: YYYY-MM-DD HH:MM | - | Fecha de registro en sistema |

### Reglas de Negocio

1. **Gastos del mes** = SUM(Monto) WHERE Fecha = mes actual
2. **Gastos por categoría** = GROUP BY Categoría
3. **Margen** = (Ingresos mes - Gastos mes) / Ingresos mes × 100
4. **Alerta si:** Gastos mes > 70% de Ingresos mes
5. **Gastos recurrentes** - Recordatorio mensual automático

### Ejemplos de Datos

```
GAS-2025-0001 | 2025-11-15 | Suscripción Vercel Pro | Software | 240000 | Tarjeta | Vercel Inc | - | Pagado | drive.google.com/file/xxx | Sí | Hosting para proyectos | 2025-11-15 08:30
```

---

## 🔗 RELACIONES ENTRE HOJAS

### Diagrama de Flujo de Datos

```
PIPELINE (Lead ganado)
    ↓
PROYECTOS (Se crea proyecto)
    ↓
FACTURACIÓN (Se factura proyecto)
    ↓
[Se registra pago]

CONTACTOS
    ↑ ↓
PIPELINE / PROYECTOS / PROMOTORES

PROMOTORES → PIPELINE (Fuente = Referido)
    ↓
[Si lead cierra] → Comisión Generada ++

GASTOS → PROYECTOS (opcional, para costeo)
```

### Integraciones Automáticas

1. **Lead ganado en Pipeline** → Crear Proyecto automático + Factura Anticipo
   - Cuando estado cambia a "Ganado":
     - Sistema pregunta si crear proyecto
     - Se crea proyecto con: Cliente, Email, Valor
     - Estado inicial: "Activo"
     - Fase inicial: "Discovery" (10% progreso)
     - Fecha Inicio: Hoy
     - Fecha Entrega Estimada: Hoy + 30 días
   - Sistema pregunta si generar factura anticipo:
     - Se crea factura tipo "Anticipo 50%"
     - Monto: 50% del valor del proyecto + IVA 19%
     - Vencimiento: Hoy + 15 días

2. **Proyecto >= 90% progreso** → Habilitar Factura Saldo
   - Botón "💵 Saldo" aparece en tabla Proyectos
   - Al hacer clic:
     - Valida que exista factura de anticipo
     - Valida que no exista factura de saldo previa
     - Crea factura tipo "Saldo 50%"
     - Monto: 50% del valor del proyecto + IVA 19%
     - Vencimiento: Hoy + 15 días

3. **Nuevo Lead en Pipeline** → Verificar/Crear Contacto
   - Si Email existe → Vincular
   - Si no existe → Crear nuevo contacto

4. **Proyecto en Facturación** → Validar que existe
   - Dropdown solo muestra proyectos activos/completados
   - Auto-completa Cliente desde Proyectos

5. **Validación de % Facturado** → Bloqueo automático
   - Al crear/editar factura manualmente:
     - Sistema calcula total % facturado del proyecto
     - Si nuevo % + existente > 100% → Muestra error y bloquea guardado
     - Muestra mensaje: "El proyecto ya tiene X% facturado, no puedes agregar Y% más"

6. **Promotor refiere Lead** → Actualizar métricas
   - Referidos Totales ++
   - Si Lead cierra → Proyectos Ganados ++ y Comisión Generada += Valor × %

7. **Cliente en Proyectos** → Autocompletar desde Contactos
   - Traer Email automáticamente
   - Validar que existe en base de datos

---

## 🔧 CONSIDERACIONES TÉCNICAS

### Formatos de Datos

**Fechas:**
- Almacenar: `YYYY-MM-DD HH:MM:SS`
- Mostrar: `DD/MM/YYYY` o formato local

**Números:**
- Almacenar: Números puros (ej: 15000000)
- Mostrar: Formato moneda `$15.000.000 COP`

**IDs Auto-generados:**
```javascript
function generateID(prefix, year, count) {
  return `${prefix}-${year}-${String(count).padStart(4, '0')}`;
}
// Ejemplo: PIP-2025-0001
```

### Validaciones Frontend

```javascript
// Validar email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validar teléfono Colombia
const phoneRegex = /^\+57 \d{3} \d{3} \d{4}$/;

// Validar URL
const urlRegex = /^https?:\/\/.+/;

// Validar rango 0-100
const inRange = (val) => val >= 0 && val <= 100;
```

### Índices y Performance

Para optimizar búsquedas en Google Sheets:
- Crear "Named Ranges" para cada hoja
- Usar VLOOKUP/INDEX-MATCH para relaciones
- Cachear datos leídos por 5 minutos
- Batch updates cuando sea posible

---

## 📝 NOTAS FINALES

1. **Google Sheet ID:** Mauricio debe proporcionar el ID del Sheet una vez creado
2. **Permisos:** El Client ID OAuth debe tener acceso al Sheet
3. **Backup:** Configurar exportación automática semanal
4. **Auditoría:** Campos "Fecha Actualización" para trazabilidad
5. **Escalabilidad:** Si alguna hoja supera 10,000 filas, considerar archivado

---

**Próximo documento:** DESIGN_SPEC.md (wireframes y componentes UI)

**Versión:** 1.0
**Estado:** En revisión
**Última actualización:** 2 Diciembre 2025
