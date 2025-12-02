# Sistema MéTRIK - Dashboard + CRM Interno

Sistema operativo interno de MéTRIK construido con HTML/JS vanilla + Google Sheets API v4.

**Demo:** https://metrik360.github.io/metrik-sistema-dashboard (próximamente en metrik.com.co)

---

## 🎯 Descripción

Sistema de gestión integral que incluye:
- 📊 Dashboard con KPIs en tiempo real
- 🎯 CRM (Pipeline comercial)
- 📋 Gestión de proyectos
- 💰 Control de facturación
- 👥 Base de datos de contactos
- 🤝 Red de promotores
- 💸 Control de gastos

**Stack Tecnológico:**
- HTML5 + CSS3 (Tailwind CSS vía CDN)
- JavaScript vanilla (sin frameworks)
- Google Sheets API v4
- Chart.js 4.4.0
- OAuth 2.0

---

## 🚀 Setup Inicial

### 1. Configuración de Google Cloud Console

Este proyecto ya está configurado, pero si necesitas replicarlo:

1. **Crear proyecto en Google Cloud Console**
   - Ve a: https://console.cloud.google.com/
   - Crea un nuevo proyecto

2. **Habilitar Google Sheets API**
   - Ve a: https://console.cloud.google.com/apis/library/sheets.googleapis.com
   - Click en "ENABLE"

3. **Configurar OAuth 2.0**
   - Ve a: https://console.cloud.google.com/apis/credentials/consent
   - Configura el OAuth Consent Screen (External)
   - Agrega scope: `https://www.googleapis.com/auth/spreadsheets`

4. **Crear Client ID**
   - Ve a: https://console.cloud.google.com/apis/credentials
   - Crear credenciales → OAuth client ID
   - Tipo: Web application
   - Authorized JavaScript origins: `https://metrik360.github.io`
   - Authorized redirect URIs: `https://metrik360.github.io/metrik-sistema-dashboard`

### 2. Configuración del Proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/metrik360/metrik-sistema-dashboard.git
   cd metrik-sistema-dashboard
   ```

2. **Configurar credenciales (si es necesario):**

   Edita `config.js` con tus credenciales:
   ```javascript
   const CONFIG = {
       CLIENT_ID: 'TU-CLIENT-ID.apps.googleusercontent.com',
       SHEET_ID: 'TU-GOOGLE-SHEET-ID',
       // ...
   };
   ```

3. **Configurar Google Sheet:**

   Tu Google Sheet debe tener estas 6 hojas (tabs):
   - Pipeline
   - Proyectos
   - Facturación
   - Contactos
   - Promotores
   - Gastos

   Ver estructura detallada en: `DATA_SPEC.md`

### 3. Desarrollo Local

Para probar localmente, usa un servidor HTTP simple:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: PHP
php -S localhost:8000

# Opción 3: npx (Node.js)
npx serve
```

Luego abre: http://localhost:8000

**Nota:** Asegúrate de agregar `http://localhost:8000` en las URLs autorizadas de OAuth en Google Cloud Console.

---

## 📦 Deploy a GitHub Pages

### Opción A: Desde la interfaz web de GitHub

1. Ve a: https://github.com/metrik360/metrik-sistema-dashboard/settings/pages
2. En "Source", selecciona: `main` branch
3. Click "Save"
4. Espera 1-2 minutos
5. Tu sitio estará en: https://metrik360.github.io/metrik-sistema-dashboard

### Opción B: Desde la terminal

```bash
# 1. Asegúrate de estar en la rama main
git checkout main

# 2. Push a GitHub (si no lo has hecho)
git push origin main

# 3. GitHub Pages se activará automáticamente si está configurado
```

---

## 🌐 Conectar Dominio Personalizado (metrik.com.co)

### 1. Configurar DNS

En tu proveedor de DNS (ej: GoDaddy, Namecheap, etc.):

Agrega estos registros DNS:

```
Tipo: A
Nombre: @
Valor: 185.199.108.153

Tipo: A
Nombre: @
Valor: 185.199.109.153

Tipo: A
Nombre: @
Valor: 185.199.110.153

Tipo: A
Nombre: @
Valor: 185.199.111.153

Tipo: CNAME
Nombre: www
Valor: metrik360.github.io
```

### 2. Crear archivo CNAME

```bash
echo "metrik.com.co" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

### 3. Configurar en GitHub

1. Ve a: https://github.com/metrik360/metrik-sistema-dashboard/settings/pages
2. En "Custom domain", escribe: `metrik.com.co`
3. Click "Save"
4. Espera a que se verifique el DNS (puede tardar hasta 24 horas)
5. Una vez verificado, marca: "Enforce HTTPS"

---

## 🔒 Seguridad

### OAuth 2.0

- El Client ID está en el código (esto es seguro para aplicaciones públicas)
- NO se almacena Client Secret (no es necesario para OAuth implicit flow)
- Los tokens de acceso expiran automáticamente
- El usuario debe autenticarse cada vez que cierra sesión

### Google Sheets

- Solo usuarios autenticados pueden acceder
- El Sheet debe tener permisos configurados correctamente
- Recomendado: Compartir el Sheet solo con los usuarios necesarios

---

## 📚 Documentación

- **[REQUIREMENTS_DOC.md](./REQUIREMENTS_DOC.md)** - Especificaciones completas del proyecto
- **[DATA_SPEC.md](./DATA_SPEC.md)** - Estructura de datos (6 hojas de Google Sheets)
- **[DESIGN_SPEC.md](./DESIGN_SPEC.md)** - Sistema de diseño y componentes UI
- **[PROJECT_STATE.md](./PROJECT_STATE.md)** - Estado actual del proyecto

---

## 🛠️ Estructura del Proyecto

```
metrik-sistema-dashboard/
├── index.html              # Aplicación principal (SPA)
├── config.js               # Configuración (OAuth, Sheet ID)
├── .gitignore              # Archivos ignorados por Git
├── README.md               # Este archivo
├── REQUIREMENTS_DOC.md     # Requirements completos
├── DATA_SPEC.md            # Especificación de datos
├── DESIGN_SPEC.md          # Especificación de diseño
└── PROJECT_STATE.md        # Tracking del proyecto
```

---

## 🐛 Troubleshooting

### Error: "Access blocked: This app's request is invalid"

**Solución:**
1. Ve a Google Cloud Console → OAuth consent screen
2. Agrega tu email en "Test users"
3. Verifica que el scope esté agregado

### Error: "Origin not allowed"

**Solución:**
1. Ve a Google Cloud Console → Credentials
2. Edita tu OAuth Client ID
3. Agrega la URL en "Authorized JavaScript origins"

---

## 📞 Soporte

**Repositorio:** https://github.com/metrik360/metrik-sistema-dashboard

---

**Última actualización:** 2 Diciembre 2025
**Versión:** 1.0.0
