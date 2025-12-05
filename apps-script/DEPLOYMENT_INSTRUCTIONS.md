# 📝 Instrucciones de Despliegue - Google Apps Script Backend

## 🎯 Objetivo
Desplegar un backend de Google Apps Script que elimine la necesidad de popups de autorización OAuth para cada usuario.

---

## 📋 Paso 1: Crear el Proyecto de Apps Script

1. **Abre Google Sheets** con tu hoja de datos:
   - URL: `https://docs.google.com/spreadsheets/d/16uKHN5v6DhGCMjuyUaC84yIw9Fx-DKjayP2NRINrAJc`

2. **Abre el Editor de Apps Script:**
   - En el menú: `Extensiones` → `Apps Script`
   - Se abrirá una nueva pestaña con el editor

3. **Elimina el código por defecto:**
   - Borra todo el contenido del archivo `Code.gs`

4. **Copia el código del backend:**
   - Abre el archivo `apps-script/Code.gs` de este repositorio
   - Copia TODO el contenido
   - Pégalo en el editor de Apps Script

5. **Guarda el proyecto:**
   - Click en el ícono de disquete 💾
   - O usa `Ctrl+S` / `Cmd+S`
   - Nombra el proyecto: `MéTRIK Sistema API`

---

## 🚀 Paso 2: Desplegar como Web App

1. **Click en "Implementar"** (Deploy) en la esquina superior derecha
   - Selecciona: `Nueva implementación` / `New deployment`

2. **Configura la implementación:**

   **Tipo (Type):**
   - Selecciona: ⚙️ `Aplicación web` / `Web app`

   **Descripción (Description):**
   - Escribe: `MéTRIK API v1.0`

   **Ejecutar como (Execute as):**
   - ⚠️ **MUY IMPORTANTE:** Selecciona `Yo` / `Me` (tu email)
   - Esto permite que el script acceda a tus hojas de cálculo

   **Quién tiene acceso (Who has access):**
   - ⚠️ **MUY IMPORTANTE:** Selecciona `Cualquier usuario` / `Anyone`
   - Esto permite que usuarios sin cuenta de Google accedan al API

3. **Autoriza el script:**
   - Click en `Implementar` / `Deploy`
   - Aparecerá un mensaje de autorización
   - Click en `Autorizar acceso` / `Authorize access`
   - Selecciona tu cuenta de Google
   - **⚠️ Verás una advertencia de "Google hasn't verified this app"**
   - Click en `Avanzado` / `Advanced`
   - Click en `Ir a MéTRIK Sistema API (no seguro)` / `Go to MéTRIK Sistema API (unsafe)`
   - Click en `Permitir` / `Allow`

4. **Copia la URL de la Web App:**
   - Después de autorizar, verás una URL que termina en `/exec`
   - **⚠️ IMPORTANTE:** Copia esta URL completa
   - Ejemplo: `https://script.google.com/macros/s/AKfycby.../exec`
   - **Guárdala en un lugar seguro** - la necesitarás para el frontend

---

## 🧪 Paso 3: Probar el API

Antes de integrar con el frontend, prueba que funcione:

### Test 1: Autenticación

1. Abre una nueva pestaña del navegador
2. Construye esta URL (reemplaza con tu URL del paso anterior y tus credenciales):

```
TU_URL_AQUI?action=authenticate&email=mauricio.moreno@metrik.com.co&pin=1234
```

**Ejemplo completo:**
```
https://script.google.com/macros/s/AKfycby.../exec?action=authenticate&email=mauricio.moreno@metrik.com.co&pin=1234
```

3. **Resultado esperado:**
```json
{
  "success": true,
  "user": {
    "id": "USR-2025-0001",
    "email": "mauricio.moreno@metrik.com.co",
    "nombre": "Mauricio Moreno",
    "rol": "Super Admin",
    "empresaId": "MéTRIK",
    "permisos": {}
  }
}
```

### Test 2: Leer Datos

```
TU_URL_AQUI?action=read&sheet=USUARIOS&range=A2:K
```

**Resultado esperado:** JSON con los datos de la hoja Usuarios

---

## 📌 Paso 4: Guardar la URL del API

Crea un archivo de configuración con la URL:

1. En tu repositorio, abre el archivo `index.html`
2. Busca la sección de CONFIG (línea ~26)
3. Agrega esta nueva propiedad:

```javascript
const CONFIG = {
    // ... código existente ...

    // Apps Script API URL
    APPS_SCRIPT_URL: 'TU_URL_AQUI',  // ⚠️ Reemplaza con tu URL real

    // ... resto del código ...
};
```

---

## 🔧 Paso 5: Actualizar Versiones Futuras

Cuando necesites actualizar el código del Apps Script:

1. Abre el editor de Apps Script
2. Modifica el código
3. Guarda los cambios (`Ctrl+S` / `Cmd+S`)
4. **Nueva Implementación:**
   - Click en `Implementar` → `Administrar implementaciones`
   - Click en el lápiz ✏️ junto a la implementación activa
   - En "Versión", selecciona `Nueva versión`
   - Agrega descripción de los cambios
   - Click en `Implementar`

⚠️ **IMPORTANTE:** La URL del API **NO cambia** entre versiones

---

## 🛡️ Seguridad

### ¿Es seguro?

✅ **SÍ**, porque:
- El script se ejecuta con **tus credenciales** (dueño de la hoja)
- Valida Email+PIN contra la hoja de Usuarios
- Solo usuarios registrados pueden acceder
- CORS está configurado para tu dominio únicamente

### Limitaciones de Seguridad

⚠️ **Ten en cuenta:**
- La URL del API es pública (cualquiera que la tenga puede llamarla)
- Pero solo funcionará con credenciales válidas
- Considera agregar rate limiting en el futuro
- Monitorea los logs de Apps Script

---

## 📊 Monitoreo

### Ver logs del script:

1. En el editor de Apps Script
2. Click en `Ejecuciones` / `Executions` en el menú lateral
3. Aquí verás todas las llamadas al API y errores

### Ver uso:

- Google Apps Script tiene un límite diario de llamadas
- Límite gratuito: ~20,000 llamadas/día
- Suficiente para uso normal del sistema

---

## ❓ Troubleshooting

### Error: "Script function not found"
- Verifica que el nombre del archivo sea `Code.gs`
- Verifica que guardaste los cambios

### Error: "Authorization required"
- Re-autoriza el script en las configuraciones de implementación

### Error: "Exception: Cannot find sheet"
- Verifica que el SHEET_ID en el código sea correcto
- Verifica los nombres de las hojas en español (con tildes)

### API no responde
- Verifica que la URL termine en `/exec` (no `/dev`)
- Verifica que la implementación esté activa

---

## ✅ Checklist Final

Antes de continuar al frontend:

- [ ] Apps Script creado y código copiado
- [ ] Proyecto guardado con nombre "MéTRIK Sistema API"
- [ ] Implementado como Web App
- [ ] Autorización completada
- [ ] URL del API copiada y guardada
- [ ] Test de autenticación exitoso
- [ ] Test de lectura de datos exitoso
- [ ] URL agregada al CONFIG en index.html

---

## 📞 Próximos Pasos

Una vez completados estos pasos, estarás listo para:
1. Actualizar el frontend para usar el Apps Script API
2. Eliminar dependencia de Google OAuth en el cliente
3. ¡Usuarios ingresan solo con Email+PIN sin popups!

---

**¿Necesitas ayuda?** Revisa los logs del Apps Script o contacta al desarrollador.
