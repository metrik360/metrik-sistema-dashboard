# INSTRUCCIONES CLAUDE CODE: MÓDULO COMERCIAL - FRAMEWORK FINANCIERO MéTRIK

**Versión:** 1.0  
**Fecha:** 22 Diciembre 2025  
**Autor:** Vera Mendoza (COO) + Equipo Directivo MéTRIK  
**Aprobado por:** Mauricio Moreno (CEO)  
**Status:** ✅ APROBADO PARA DESARROLLO

---

## 1. CONTEXTO DEL PROYECTO

### 1.1 Objetivo
Construir el módulo COMERCIAL del Framework Financiero MéTRIK que conecte indicadores de pipeline/ventas con resultados financieros (Estado de Resultados y Flujo de Caja).

### 1.2 Filosofía
- **"MéTRIK practica lo que predica"** - Este es el sistema interno de MéTRIK
- Cada indicador comercial DEBE mostrar su conexión con Flujo de Caja o Estado de Resultados
- Diseño para ser replicable en clientes futuros

### 1.3 Alcance Módulo Comercial
- Pipeline y gestión de oportunidades
- Indicadores de conversión y velocidad de venta
- Forecast por fecha de cierre esperada
- Conexión directa con proyecciones financieras

### 1.4 Fuera de Alcance (Este Sprint)
- Módulo de Operaciones
- Módulo de Gestión Humana
- Módulo de Marketing
- Intereses sobre inversiones

---

## 2. STACK TECNOLÓGICO

| Componente | Tecnología | Notas |
|------------|------------|-------|
| Base de datos | Google Sheets | URLs proporcionadas por Mauricio |
| Frontend | HTML5 + CSS3 (Tailwind CDN) | Archivo único index.html |
| Gráficas | Chart.js 4.4.0 | Via CDN |
| Parsing datos | PapaParse 5.3.2 | Via CDN |
| Iconos | Font Awesome 6.4.0 | Via CDN |
| Fuente | Inter (Google Fonts) | Via CDN |
| Hosting | GitHub Pages | Dominio personalizado opcional |

### 2.1 CDN Links Requeridos

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MéTRIK - Dashboard Comercial</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  
  <!-- PapaParse -->
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.3.2/papaparse.min.js"></script>
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Inter Font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

---

## 3. ESTRUCTURA DE DATOS

### 3.1 HOJA: PIPELINE

#### Campos Requeridos

| Campo | Tipo | Obligatorio | Descripción | Ejemplo |
|-------|------|-------------|-------------|---------|
| `id` | Texto | Sí | Identificador único | "OPP-001" |
| `nombre_oportunidad` | Texto | Sí | Nombre del deal | "SOENA - Transformación" |
| `empresa` | Texto | Sí | Nombre del prospecto | "SOENA S.A.S." |
| `valor` | Número | Sí | Valor en COP | 16000000 |
| `etapa` | Selector | Sí | Etapa del embudo | Ver sección 4 |
| `probabilidad` | Número | Sí | % probabilidad cierre | 80 |
| `fecha_creacion` | Fecha | Sí | Cuándo entró al pipeline | 2025-11-15 |
| `fecha_cierre_esperada` | Fecha | Sí | Mes/Año esperado de cierre | 2026-01-31 |
| `fecha_cierre_real` | Fecha | No | Fecha real de cierre (si cerró) | 2026-01-12 |
| `estado` | Selector | Sí | Abierta/Ganada/Perdida | "Abierta" |
| `razon_perdida` | Selector | Condicional | Por qué se perdió | "Precio" |
| `responsable` | Texto | Sí | Quién lleva la cuenta | "Mauricio" |
| `servicio` | Selector | Sí | Qué servicio | "Combo $6.5M" |
| `fuente` | Selector | Sí | Cómo llegó | "Referido" |
| `notas` | Texto | No | Observaciones | "Contactar en enero" |

#### Opciones para Selectores

**Servicios:**
| Servicio | Valor Referencia |
|----------|------------------|
| Audit Datos | $500,000 |
| Clean-Up Básico | $1,000,000 |
| Clean-Up Avanzado | $2,000,000 |
| Dashboard Claridad | $5,000,000 |
| Combo | $6,500,000 |
| Transformación Básica | $15,000,000 |
| Transformación Completa | $40,000,000 |
| Retainer Mensual | $2,000,000 |

**Fuentes:**
- Referido Personal
- Referido Cliente
- LinkedIn Orgánico
- LinkedIn Pauta
- Alianza Comercial
- Evento/Webinar
- Website
- Otro

**Razones de Pérdida:**
- Precio
- Timing (no es el momento)
- Competencia
- No hay presupuesto
- No hay decisor
- Ghosting (no responde)
- No cumple ICP
- Otro

---

### 3.2 HOJA: CAJA

| Campo | Tipo | Obligatorio | Descripción | Ejemplo |
|-------|------|-------------|-------------|---------|
| `fecha` | Fecha | Sí | Fecha del registro | 2025-12-22 |
| `caja_disponible` | Número | Sí | Efectivo total disponible | 32000000 |
| `notas` | Texto | No | Observaciones | "Post-pago proyecto $4.5M" |

**Nota:** Mauricio actualiza manualmente 1x/semana o cuando hay movimiento significativo. El dashboard lee el último registro.

---

### 3.3 HOJA: PARAMETROS

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| costos_fijos_mes | 7100000 | Costos fijos mensuales en COP |
| margen_contribucion | 0.85 | 85% margen sobre ingresos |
| terminos_pago_default | 50-50 | 50% anticipo, 50% entrega |
| dias_ejecucion_promedio | 10 | Días para entregar un proyecto |

---

## 4. ETAPAS DEL PIPELINE - DEFINICIÓN DETALLADA

Cada etapa tiene **criterios de entrada** específicos. La oportunidad avanza cuando se cumple el criterio, no antes.

### 4.1 Tabla Resumen

| Etapa | Prob. | Criterio de Entrada | Pregunta Clave |
|-------|-------|---------------------|----------------|
| **Lead** | 10% | Contacto identificado con posible necesidad | ¿Sabemos quién es y que podría necesitar BI? |
| **Contactado** | 15% | Respuesta del prospecto (cualquier canal) | ¿Nos respondió? |
| **Calificado** | 25% | Confirmado fit con ICP + dolor identificado | ¿Califica como cliente ideal y tiene problema que resolvemos? |
| **Propuesta Enviada** | 40% | Propuesta formal enviada y recibida | ¿Tiene nuestra propuesta en sus manos? |
| **Negociación** | 60% | Prospecto dio feedback sobre propuesta | ¿Está evaluando activamente? |
| **Cierre Verbal** | 80% | "Sí" verbal, pendiente formalizar | ¿Dijo que sí? |
| **Contrato Firmado** | 95% | Contrato firmado, pendiente pago | ¿Firmó? |
| **Ganado** | 100% | Pago recibido (al menos anticipo) | ¿Entró plata? |
| **Perdido** | 0% | Prospecto declinó o se descartó | ¿Por qué se perdió? |

### 4.2 Detalle por Etapa

#### LEAD (10%)
**Qué significa:** Tenemos un nombre y creemos que podría necesitar nuestro servicio.

**Criterios para estar aquí:**
- Nombre del contacto
- Empresa identificada
- Al menos un dato de contacto (email, teléfono, LinkedIn)
- Fuente de donde llegó

**Para avanzar a Contactado:**
- Enviar primer mensaje/llamada
- Recibir respuesta (aunque sea "no me interesa")

---

#### CONTACTADO (15%)
**Qué significa:** El prospecto sabe que existimos y respondió.

**Criterios para estar aquí:**
- Respuesta recibida (email, WhatsApp, llamada)
- Fecha de primer contacto registrada

**Para avanzar a Calificado:**
- Tener call o conversación donde se valide:
  - Tamaño empresa (20-500 empleados)
  - Facturación mínima ($5B+/año)
  - Dolor identificado (uno de los 3 escenarios)
  - Tomador de decisión identificado

---

#### CALIFICADO (25%)
**Qué significa:** Confirmamos que es cliente ideal y tiene un problema que resolvemos.

**Criterios para estar aquí:**
- Checklist ICP aprobado:
  - [ ] Tamaño correcto
  - [ ] Sector compatible
  - [ ] Dolor identificado
  - [ ] Presupuesto probable
  - [ ] Tomador de decisión accesible
- Call de discovery realizado
- Dolor específico documentado

**Para avanzar a Propuesta Enviada:**
- Enviar propuesta formal con precio y alcance

---

#### PROPUESTA ENVIADA (40%)
**Qué significa:** El prospecto tiene nuestra oferta formal.

**Criterios para estar aquí:**
- Propuesta enviada (PDF/email)
- Confirmación de recepción
- Fecha de envío registrada
- Servicio y precio especificados

**Para avanzar a Negociación:**
- Prospecto da feedback sobre la propuesta
- Cualquier pregunta, objeción, o solicitud de ajuste

---

#### NEGOCIACIÓN (60%)
**Qué significa:** Están evaluando activamente, hay diálogo sobre términos.

**Criterios para estar aquí:**
- Feedback recibido sobre propuesta
- Objeciones documentadas
- Ajustes solicitados (si hay)

**Para avanzar a Cierre Verbal:**
- Prospecto dice "sí, vamos" (verbal o escrito)
- Acuerdo en precio y alcance

---

#### CIERRE VERBAL (80%)
**Qué significa:** Dijeron que sí, falta formalizar.

**Criterios para estar aquí:**
- "Sí" explícito del tomador de decisión
- Precio final acordado
- Fecha de inicio tentativa

**Para avanzar a Contrato Firmado:**
- Enviar contrato
- Recibir contrato firmado

---

#### CONTRATO FIRMADO (95%)
**Qué significa:** Legalmente comprometidos, falta el pago.

**Criterios para estar aquí:**
- Contrato firmado por ambas partes
- Fecha de firma registrada

**Para avanzar a Ganado:**
- Recibir pago (mínimo anticipo 50%)

---

#### GANADO (100%)
**Qué significa:** Deal cerrado, plata en el banco.

**Criterios para estar aquí:**
- Pago recibido (al menos anticipo)
- Fecha de pago registrada
- Proyecto listo para iniciar

---

#### PERDIDO (0%)
**Qué significa:** No va a pasar.

**Criterios para estar aquí:**
- Prospecto declinó explícitamente, O
- Sin respuesta después de 3 intentos en 30 días, O
- Descartado por no cumplir ICP

**Obligatorio:** Documentar razón de pérdida en campo `razon_perdida`

---

## 5. INDICADORES COMERCIALES

### 5.1 INDICADOR 1: Pipeline Total

**Definición:** Suma de valores de todas las oportunidades abiertas

**Fórmula JavaScript:**
```javascript
const pipelineTotal = oportunidades
  .filter(o => o.estado === 'Abierta')
  .reduce((sum, o) => sum + parseFloat(o.valor), 0);
```

**Conexión Financiera:**
| Indicador Comercial | → | Indicador Financiero |
|---------------------|---|---------------------|
| Pipeline Total | → | **Ingreso Potencial Máximo** |

**Interpretación:**
- Estado de Resultados: "Si cierro TODO el pipeline, mi línea de Ingresos sería $X"
- Flujo de Caja: "Pipeline de $25M = máximo $25M que puede entrar a caja (escenario irreal)"

---

### 5.2 INDICADOR 2: Pipeline Ponderado

**Definición:** Valor esperado ajustado por probabilidad de cierre

**Fórmula JavaScript:**
```javascript
const pipelinePonderado = oportunidades
  .filter(o => o.estado === 'Abierta')
  .reduce((sum, o) => sum + (parseFloat(o.valor) * (parseFloat(o.probabilidad) / 100)), 0);
```

**Conexión Financiera:**
| Indicador Comercial | → | Indicador Financiero |
|---------------------|---|---------------------|
| Pipeline Ponderado | → | **Ingreso Proyectado Realista** |

**Interpretación:**
- Estado de Resultados: "Línea de Ingresos proyectada = $X en próximos 60-90 días"
- Flujo de Caja: "Entrada de caja esperada: $X (ajustar por términos de pago)"

---

### 5.3 INDICADOR 3: Tasa de Conversión

**Definición:** Efectividad del proceso comercial

**Fórmulas JavaScript:**
```javascript
// Conversión total (Lead → Cierre)
const totalLeads = oportunidades.filter(o => o.fecha_creacion).length;
const totalGanados = oportunidades.filter(o => o.estado === 'Ganado').length;
const tasaConversionTotal = (totalGanados / totalLeads) * 100;

// Conversión por etapa
function calcularConversionEtapas(oportunidades) {
  const etapas = ['Lead', 'Contactado', 'Calificado', 'Propuesta Enviada', 'Negociación', 'Cierre Verbal', 'Contrato Firmado', 'Ganado'];
  const conteo = {};
  
  etapas.forEach(etapa => {
    conteo[etapa] = oportunidades.filter(o => 
      o.etapa === etapa || 
      etapas.indexOf(o.etapa) > etapas.indexOf(etapa) ||
      o.estado === 'Ganado'
    ).length;
  });
  
  return {
    leadToCalificado: (conteo['Calificado'] / conteo['Lead']) * 100,
    calificadoToPropuesta: (conteo['Propuesta Enviada'] / conteo['Calificado']) * 100,
    propuestaToGanado: (conteo['Ganado'] / conteo['Propuesta Enviada']) * 100
  };
}
```

**Conexión Financiera:**
| Indicador Comercial | → | Indicador Financiero |
|---------------------|---|---------------------|
| Tasa Conversión | → | **Predicción de Ingresos** |

**Fórmula financiera:**
```
Ingreso Proyectado = Pipeline Total × Tasa Conversión Histórica
```

**Interpretación:**
- "Con pipeline $25M y conversión 25%, espero $6.25M en Ingresos"
- "Si conversión sube de 25% a 30%, entrada de caja aumenta $1.25M sin conseguir más leads"

---

### 5.4 INDICADOR 4: Ticket Promedio

**Definición:** Valor promedio por proyecto cerrado

**Fórmula JavaScript:**
```javascript
const proyectosGanados = oportunidades.filter(o => o.estado === 'Ganado');
const ticketPromedio = proyectosGanados.length > 0 
  ? proyectosGanados.reduce((sum, o) => sum + parseFloat(o.valor), 0) / proyectosGanados.length
  : 0;
```

**Conexión Financiera:**
| Indicador Comercial | → | Indicador Financiero |
|---------------------|---|---------------------|
| Ticket Promedio | → | **Ingreso por Unidad Vendida** |

**Fórmula financiera:**
```javascript
// Proyectos necesarios para punto de equilibrio
const puntoEquilibrio = costosFijosMes / margenContribucion;
const proyectosNecesarios = puntoEquilibrio / ticketPromedio;
```

**Interpretación:**
- "Cada proyecto cerrado = $10.25M en línea de Ingresos"
- "Necesitas X proyectos/mes para punto equilibrio"

---

### 5.5 INDICADOR 5: Ciclo de Venta (Días)

**Definición:** Tiempo promedio desde creación hasta cierre

**Fórmula JavaScript:**
```javascript
const proyectosGanados = oportunidades.filter(o => o.estado === 'Ganado' && o.fecha_cierre_real);
const cicloDias = proyectosGanados.length > 0
  ? proyectosGanados.reduce((sum, o) => {
      const dias = (new Date(o.fecha_cierre_real) - new Date(o.fecha_creacion)) / (1000 * 60 * 60 * 24);
      return sum + dias;
    }, 0) / proyectosGanados.length
  : 0;
```

**Conexión Financiera:**
| Indicador Comercial | → | Indicador Financiero |
|---------------------|---|---------------------|
| Ciclo de Venta | → | **Timing Flujo de Caja** |

**Fórmula financiera:**
```
Fecha Entrada Caja = Hoy + Ciclo Venta + Días Ejecución + Términos Pago
```

**Interpretación:**
- "Lead de hoy = plata en caja en ~X días (si cierra)"
- "Si ciclo venta baja de 30 a 20 días, caja llega 10 días antes"

---

### 5.6 INDICADOR 6: Valor Perdido

**Definición:** Valor de oportunidades cerradas como perdidas

**Fórmula JavaScript:**
```javascript
const valorPerdido = oportunidades
  .filter(o => o.estado === 'Perdido')
  .reduce((sum, o) => sum + parseFloat(o.valor), 0);

// Agrupado por razón
const perdidoPorRazon = oportunidades
  .filter(o => o.estado === 'Perdido')
  .reduce((acc, o) => {
    const razon = o.razon_perdida || 'Sin especificar';
    acc[razon] = (acc[razon] || 0) + parseFloat(o.valor);
    return acc;
  }, {});
```

**Conexión Financiera:**
| Indicador Comercial | → | Indicador Financiero |
|---------------------|---|---------------------|
| Valor Perdido | → | **Costo de Oportunidad** |

**Interpretación:**
- "Este mes perdimos $X en oportunidades"
- "Razón principal: [precio/timing/etc]"
- "Si 60% se pierde por precio → revisar pricing o calificación"

---

### 5.7 INDICADOR 7: Pipeline por Fecha de Cierre (FORECAST)

**Definición:** Distribución temporal del pipeline

**Fórmula JavaScript:**
```javascript
const pipelinePorMes = oportunidades
  .filter(o => o.estado === 'Abierta')
  .reduce((acc, o) => {
    const mes = o.fecha_cierre_esperada.substring(0, 7); // "2026-01"
    if (!acc[mes]) {
      acc[mes] = { total: 0, ponderado: 0, deals: 0 };
    }
    acc[mes].total += parseFloat(o.valor);
    acc[mes].ponderado += parseFloat(o.valor) * (parseFloat(o.probabilidad) / 100);
    acc[mes].deals += 1;
    return acc;
  }, {});
```

**Conexión Financiera - Flujo de Caja Proyectado:**
```javascript
// Si términos 50-50:
// 50% entra mes de cierre, 50% entra mes siguiente
function calcularFlujoCajaMes(mes, pipelinePorMes, parametros) {
  const entradaMesCierre = (pipelinePorMes[mes]?.ponderado || 0) * 0.5;
  const mesAnterior = obtenerMesAnterior(mes);
  const entradaMesAnterior = (pipelinePorMes[mesAnterior]?.ponderado || 0) * 0.5;
  return entradaMesCierre + entradaMesAnterior;
}
```

**Interpretación:**
- "¿En qué meses voy a tener plata y en cuáles voy a estar apretado?"
- "Pipeline abril vacío → Mayo flujo negativo"

---

## 6. CÁLCULOS FINANCIEROS

### 6.1 Parámetros Base

```javascript
const PARAMETROS_FINANCIEROS = {
  costosFijosMes: 7100000,        // $7.1M/mes
  margenContribucion: 0.85,       // 85%
  terminosPago: '50-50',          // 50% anticipo, 50% entrega
  diasEjecucionPromedio: 10       // Días para entregar proyecto
};
```

### 6.2 Punto de Equilibrio

```javascript
const puntoEquilibrio = PARAMETROS_FINANCIEROS.costosFijosMes / PARAMETROS_FINANCIEROS.margenContribucion;
// Resultado: ~$8,350,000/mes
```

### 6.3 Runway

```javascript
// Leer último registro de hoja CAJA
const ultimoRegistroCaja = cajaDatos[cajaDatos.length - 1];
const cajaDisponible = parseFloat(ultimoRegistroCaja.caja_disponible);

const runway = cajaDisponible / PARAMETROS_FINANCIEROS.costosFijosMes;
// Ejemplo: $32M / $7.1M = 4.5 meses
```

### 6.4 Cobertura Pipeline vs Punto Equilibrio

```javascript
const coberturaPE = pipelinePonderado / puntoEquilibrio;
// Si > 1 = Cubierto ✅
// Si < 1 = Alerta ⚠️
// Si < 0.5 = Crítico 🚨
```

### 6.5 Flujo de Caja Proyectado

```javascript
function proyectarFlujoCaja(meses, pipelinePorMes, parametros, cajaInicial) {
  const proyeccion = [];
  let cajaActual = cajaInicial;
  
  meses.forEach((mes, index) => {
    const entradaVentas = calcularFlujoCajaMes(mes, pipelinePorMes, parametros);
    const salidas = parametros.costosFijosMes;
    const neto = entradaVentas - salidas;
    cajaActual = cajaActual + neto;
    
    proyeccion.push({
      mes: mes,
      entradaEsperada: entradaVentas,
      salidas: salidas,
      neto: neto,
      cajaFinal: cajaActual,
      status: cajaActual > parametros.costosFijosMes * 2 ? '✅' : 
              cajaActual > parametros.costosFijosMes ? '⚠️' : '🚨'
    });
  });
  
  return proyeccion;
}
```

---

## 7. ALERTAS AUTOMÁTICAS

```javascript
function generarAlertas(datos, parametros) {
  const alertas = [];
  
  // Alerta: Mes sin pipeline
  const proximosMeses = obtenerProximos6Meses();
  proximosMeses.forEach(mes => {
    if (!pipelinePorMes[mes] || pipelinePorMes[mes].total === 0) {
      alertas.push({
        tipo: 'critica',
        icono: '🚨',
        mensaje: `Mes ${mes} sin pipeline`,
        accion: 'Llenar pipeline con fecha cierre en ese mes'
      });
    }
  });
  
  // Alerta: Pipeline < Punto Equilibrio
  if (pipelinePonderado < puntoEquilibrio) {
    alertas.push({
      tipo: 'warning',
      icono: '⚠️',
      mensaje: `Pipeline ponderado ($${formatCOP(pipelinePonderado)}) bajo punto equilibrio ($${formatCOP(puntoEquilibrio)})`,
      accion: 'Aumentar prospección o mejorar conversión'
    });
  }
  
  // Alerta: Conversión baja
  if (tasaConversionTotal < 20) {
    alertas.push({
      tipo: 'warning',
      icono: '⚠️',
      mensaje: `Tasa conversión ${tasaConversionTotal.toFixed(1)}% por debajo de benchmark (25%)`,
      accion: 'Revisar proceso de calificación y seguimiento'
    });
  }
  
  // Alerta: Runway bajo
  if (runway < 3) {
    alertas.push({
      tipo: 'critica',
      icono: '🚨',
      mensaje: `Runway de solo ${runway.toFixed(1)} meses`,
      accion: 'Acelerar cierres o reducir gastos'
    });
  }
  
  return alertas;
}
```

---

## 8. DISEÑO DEL DASHBOARD

### 8.1 Paleta de Colores MéTRIK

```javascript
const COLORES = {
  primario: '#1A1A1A',      // Negro Carbón
  acento: '#10B981',        // Verde Métrica
  secundario: '#6B7280',    // Gris Acero
  fondo: '#F9FAFB',         // Gris muy claro
  cards: '#FFFFFF',         // Blanco
  exito: '#10B981',         // Verde
  alerta: '#EF4444',        // Rojo
  warning: '#F59E0B',       // Amarillo
  info: '#3B82F6',          // Azul
};
```

### 8.2 Tipografía

```css
body {
  font-family: 'Inter', sans-serif;
}

/* Headers */
h1, h2, h3 { font-weight: 700; }

/* Body */
p, span { font-weight: 400; }

/* Números en tablas */
.numeric { 
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
}
```

### 8.3 Estructura de Navegación

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo MéTRIK]          DASHBOARD COMERCIAL         [Filtros]   │
├─────────────────────────────────────────────────────────────────┤
│  [Tab: RESUMEN]  [Tab: PIPELINE]  [Tab: FORECAST]  [Tab: $$$]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    CONTENIDO DE CADA TAB                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 TAB 1: RESUMEN (Landing Page)

```
┌────────────────────────────────────────────────────────────────┐
│                         KPIs PRINCIPALES                        │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ Pipeline     │ Ponderado    │ Conversión   │ Ticket Prom      │
│ Total        │              │              │                  │
│ $41M         │ $19M         │ 25%          │ $10.2M           │
│ ↗ vs mes ant │ ↗ vs mes ant │ ↘ vs mes ant │ ↗ vs mes ant     │
├──────────────┴──────────────┴──────────────┴──────────────────┤
│                                                                │
│  [GRÁFICA: Embudo de Conversión]    [GRÁFICA: Pipeline x Mes]  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  CONEXIÓN FINANCIERA                                           │
│  ─────────────────────                                         │
│  Ingreso Proyectado: $19M × 85% margen = $16.15M contribución  │
│  Punto Equilibrio: $8.35M/mes                                  │
│  Status: ✅ Pipeline cubre 2.3 meses de PE                     │
└────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- 4 KPI cards con valor actual y tendencia vs mes anterior
- Gráfica embudo horizontal (Chart.js bar horizontal)
- Gráfica pipeline por mes (Chart.js bar vertical)
- Panel de conexión financiera

---

### 8.5 TAB 2: PIPELINE (Detalle)

```
┌────────────────────────────────────────────────────────────────┐
│  Filtros: [Etapa ▼] [Servicio ▼] [Responsable ▼] [🔍 Buscar]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  TABLA DE OPORTUNIDADES                                        │
│  ───────────────────────                                       │
│  ID    | Empresa  | Valor   | Etapa      | Prob | Cierre Esp  │
│  ────────────────────────────────────────────────────────────  │
│  OPP-1 | SOENA    | $16M    | Cierre V.  | 80%  | Ene 2026    │
│  OPP-2 | Empresa B| $6.5M   | Propuesta  | 40%  | Feb 2026    │
│  ...                                                           │
│                                                                │
│  [< 1 2 3 ... >]                              [Exportar CSV]   │
├────────────────────────────────────────────────────────────────┤
│  Resumen: 15 oportunidades | $25M total | $8.5M ponderado     │
└────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Filtros por etapa, servicio, responsable
- Búsqueda en tiempo real
- Tabla sorteable por cualquier columna
- Paginación (20 registros por página)
- Export a CSV
- Footer con totales

---

### 8.6 TAB 3: FORECAST (Proyección Temporal)

```
┌────────────────────────────────────────────────────────────────┐
│                    PIPELINE POR MES DE CIERRE                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [GRÁFICA DE BARRAS: Pipeline Total vs Ponderado por Mes]      │
│                                                                │
│  Ene    Feb    Mar    Abr    May    Jun                        │
│  ████   ███    ██            ██     █                          │
│  $16M   $8M    $6M    $0     $5M    $3M                        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  TABLA FORECAST                                                │
│  ─────────────                                                 │
│  Mes      | Pipeline | Ponderado | Deals | Status vs PE        │
│  ──────────────────────────────────────────────────────────── │
│  Ene 2026 | $16M     | $12.8M    | 1     | ✅ Cubre PE         │
│  Feb 2026 | $8M      | $3.2M     | 3     | ⚠️ Bajo PE          │
│  Mar 2026 | $6M      | $1.8M     | 2     | 🚨 Muy bajo         │
│  Abr 2026 | $0       | $0        | 0     | 🚨 VACÍO            │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  ⚠️ ALERTA: Abril sin pipeline. Riesgo flujo caja mayo.       │
│  ACCIÓN: Llenar pipeline con fecha cierre marzo-abril.         │
└────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Gráfica de barras agrupadas (total vs ponderado por mes)
- Tabla de forecast con status vs punto equilibrio
- Panel de alertas automáticas

---

### 8.7 TAB 4: CONEXIÓN FINANCIERA ($$$)

```
┌────────────────────────────────────────────────────────────────┐
│              COMERCIAL → ESTADO DE RESULTADOS                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  INDICADOR COMERCIAL          →    INDICADOR FINANCIERO        │
│  ─────────────────────────────────────────────────────────────│
│  Pipeline Ponderado: $19M     →    Ingreso Proyectado: $19M    │
│  × Margen Contribución: 85%   →    Contribución: $16.15M       │
│  - Costos Fijos: $7.1M/mes    →    Utilidad Proyectada: $9.05M │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│              SALUD FINANCIERA                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  CAJA ACTUAL          RUNWAY          PUNTO EQUILIBRIO         │
│  ────────────         ──────          ─────────────────        │
│  $32,000,000          4.5 meses       $8,350,000/mes           │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│              FLUJO DE CAJA PROYECTADO                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [GRÁFICA LÍNEA: Evolución Caja Proyectada]                    │
│                                                                │
│  Mes    | Entrada Esp | Salidas  | Neto     | Caja Fin | Status│
│  ────────────────────────────────────────────────────────────  │
│  Dic 25 | $2.25M      | $7.1M    | -$4.85M  | $27.15M  | ⚠️    │
│  Ene 26 | $10.25M     | $7.1M    | +$3.15M  | $30.3M   | ✅    │
│  Feb 26 | $8.8M       | $7.1M    | +$1.7M   | $32M     | ✅    │
│  Mar 26 | $2.4M       | $7.1M    | -$4.7M   | $27.3M   | ⚠️    │
│  Abr 26 | $0.5M       | $7.1M    | -$6.6M   | $20.7M   | 🚨    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Panel de conexión Comercial → Estado de Resultados
- 3 KPI cards: Caja, Runway, Punto Equilibrio
- Gráfica de línea: evolución caja proyectada
- Tabla de flujo de caja mensual

---

## 9. FUNCIONALIDADES TÉCNICAS

### 9.1 Carga de Datos

```javascript
async function cargarDatos(urlCSV) {
  return new Promise((resolve, reject) => {
    Papa.parse(urlCSV, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}

// Uso
const pipelineData = await cargarDatos(URL_SHEET_PIPELINE);
const cajaData = await cargarDatos(URL_SHEET_CAJA);
const parametrosData = await cargarDatos(URL_SHEET_PARAMETROS);
```

### 9.2 Formato de Números

```javascript
// Formato COP sin decimales
function formatCOP(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}
// Resultado: $16.000.000

// Formato porcentaje
function formatPct(valor) {
  return `${valor.toFixed(1)}%`;
}

// Formato número con separadores
function formatNum(valor) {
  return new Intl.NumberFormat('es-CO').format(valor);
}
```

### 9.3 Gráficas Requeridas

| Gráfica | Tipo Chart.js | Ubicación |
|---------|---------------|-----------|
| Embudo de conversión | Bar horizontal | Tab Resumen |
| Pipeline por mes | Bar vertical stacked | Tab Resumen, Tab Forecast |
| Distribución por etapa | Doughnut | Tab Resumen |
| Pipeline por servicio | Bar horizontal | Tab Pipeline |
| Evolución flujo de caja | Line | Tab $$$ |

### 9.4 Filtros Globales

```javascript
function aplicarFiltros(datos, filtros) {
  return datos.filter(o => {
    if (filtros.etapa && o.etapa !== filtros.etapa) return false;
    if (filtros.servicio && o.servicio !== filtros.servicio) return false;
    if (filtros.responsable && o.responsable !== filtros.responsable) return false;
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      if (!o.empresa.toLowerCase().includes(busqueda) && 
          !o.nombre_oportunidad.toLowerCase().includes(busqueda)) {
        return false;
      }
    }
    return true;
  });
}
```

### 9.5 Tabla con Funcionalidades

```javascript
// Ordenamiento
function ordenarPor(datos, columna, direccion = 'asc') {
  return [...datos].sort((a, b) => {
    let valA = a[columna];
    let valB = b[columna];
    
    // Detectar si es número
    if (!isNaN(parseFloat(valA))) {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    }
    
    if (direccion === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });
}

// Paginación
function paginar(datos, pagina, porPagina = 20) {
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  return {
    datos: datos.slice(inicio, fin),
    totalPaginas: Math.ceil(datos.length / porPagina),
    paginaActual: pagina
  };
}

// Export CSV
function exportarCSV(datos, nombreArchivo) {
  const csv = Papa.unparse(datos);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nombreArchivo}.csv`;
  link.click();
}
```

---

## 10. RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile first */
/* Base: < 640px */

/* Tablet: >= 640px */
@media (min-width: 640px) { }

/* Laptop: >= 1024px */
@media (min-width: 1024px) { }

/* Desktop: >= 1280px */
@media (min-width: 1280px) { }
```

### Comportamiento por Breakpoint

| Elemento | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| KPI Cards | 1 columna | 2 columnas | 4 columnas |
| Gráficas | Full width, stack | 2 columnas | 2 columnas |
| Tabla | Scroll horizontal | Visible completa | Visible completa |
| Tabs | Scroll horizontal | Visible | Visible |
| Filtros | Colapsados | Inline | Inline |

---

## 11. ESTRUCTURA DE ARCHIVOS OUTPUT

```
📁 metrik-dashboard-comercial/
├── index.html              (Todo el código en un archivo único)
├── README.md               (Instrucciones de uso y mantenimiento)
└── docs/
    └── estructura_datos.md (Descripción de campos requeridos)
```

---

## 12. CRITERIOS DE VALIDACIÓN (QA)

### 12.1 Funcionalidad

- [ ] Carga datos del Google Sheet sin errores
- [ ] Los 7 indicadores calculan correctamente
- [ ] Filtros funcionan y actualizan todos los elementos
- [ ] Tabla es sorteable por todas las columnas
- [ ] Tabla es buscable en tiempo real
- [ ] Export CSV descarga correctamente
- [ ] Paginación funciona
- [ ] Navegación entre tabs funciona
- [ ] Alertas se generan según condiciones
- [ ] Gráficas renderizan correctamente

### 12.2 Conexión Financiera

- [ ] Pipeline Ponderado → Ingreso Proyectado visible
- [ ] Cálculo de Punto Equilibrio correcto ($8.35M)
- [ ] Runway calcula correctamente (Caja / Costos Fijos)
- [ ] Flujo de Caja proyectado por mes correcto
- [ ] Status vs PE muestra correctamente (✅ ⚠️ 🚨)

### 12.3 Diseño

- [ ] Colores MéTRIK aplicados (Negro #1A1A1A, Verde #10B981, Gris #6B7280)
- [ ] Fuente Inter carga correctamente
- [ ] Formato números COP consistente ($X.XXX.XXX)
- [ ] Responsive funciona en Mobile, Tablet, Desktop
- [ ] Sin scroll horizontal indeseado
- [ ] Sin errores en consola del navegador

### 12.4 Validación Manual de Cálculos

Antes de entregar, validar manualmente:
1. Sumar pipeline total en Sheet vs dashboard
2. Calcular pipeline ponderado manual vs dashboard
3. Verificar 3 registros individuales en tabla
4. Verificar runway: Caja ÷ Costos Fijos

---

## 13. INSTRUCCIÓN DE ACTIVACIÓN PARA CLAUDE CODE

```
Soy el sistema MéTRIK. Necesito que construyas el MÓDULO COMERCIAL 
del Framework Financiero siguiendo las instrucciones del documento 
"INSTRUCCIONES_CLAUDE_CODE_MODULO_COMERCIAL_v1.md".

Fuentes de datos (Google Sheets publicados como CSV):
- PIPELINE: [URL proporcionada por Mauricio]
- CAJA: [URL proporcionada por Mauricio]
- PARAMETROS: [URL proporcionada por Mauricio]

Requisitos críticos:
1. Archivo único index.html con todo embebido (HTML + CSS + JS)
2. Los 7 indicadores comerciales con conexión financiera visible
3. 4 tabs: Resumen, Pipeline, Forecast, Conexión $$$
4. Alertas automáticas según condiciones definidas
5. Diseño con paleta MéTRIK (Negro #1A1A1A, Verde #10B981, Gris #6B7280)
6. Responsive (Mobile, Tablet, Desktop)
7. Tabla con sort, search, pagination, export CSV

Genera el código completo y funcional.
```

---

## 14. SIGUIENTE PASO

**Para activar Claude Code, Mauricio debe proporcionar:**

1. URL del Google Sheet PIPELINE (publicado como CSV)
2. URL del Google Sheet CAJA (publicado como CSV) 
3. URL del Google Sheet PARAMETROS (publicado como CSV)

**O confirmar que Claude Code debe crear la estructura de Sheets desde cero.**

---

**FIN DEL DOCUMENTO**

---

*Documento generado por el Equipo Directivo MéTRIK*  
*Vera Mendoza (COO) - Estructura y validación operacional*  
*Carmen Vásquez (CFO) - Conexiones financieras*  
*Santiago Herrera (CCO) - Indicadores comerciales*  
*Mik - Consolidación y síntesis*  

**Versión:** 1.0  
**Fecha:** 22 Diciembre 2025  
**Status:** ✅ APROBADO PARA DESARROLLO
