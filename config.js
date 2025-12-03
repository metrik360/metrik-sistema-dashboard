// Configuration file for Sistema MéTRIK
const CONFIG = {
    // OAuth 2.0 Configuration
    CLIENT_ID: '482658322972-3nst66clokld9b2rcjarg8i5v5ngo540.apps.googleusercontent.com',
    SCOPES: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email',
    DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],

    // Google Sheets Configuration
    SHEET_ID: '16uKHN5v6DhGCMjuyUaC84yIw9Fx-DKjayP2NRINrAJc',

    // Sheet Names (tabs in Google Sheets)
    SHEETS: {
        PIPELINE: 'Pipeline',
        PROYECTOS: 'Proyectos',
        FACTURACION: 'Facturación',
        CONTACTOS: 'Contactos',
        PROMOTORES: 'Promotores',
        SERVICIOS: 'Servicios',
        GASTOS: 'Gastos',
        USUARIOS: 'Usuarios'
    },

    // Cache Configuration (in milliseconds)
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

    // Authentication & Authorization
    SUPER_ADMIN_EMAILS: [
        'bmmorenog@gmail.com',           // Email actual
        'mauricio.moreno@metrik.com.co'  // Email Google Workspace (futuro)
    ],

    // Roles
    ROLES: {
        SUPER_ADMIN: 'Super Admin',
        ADMIN_LOCAL: 'Admin Local',
        SUPERVISOR: 'Supervisor',
        USUARIO: 'Usuario'
    },

    // Session Configuration
    SESSION_DURATION: 8 * 60 * 60 * 1000, // 8 hours

    // App Configuration
    APP_NAME: 'Sistema MéTRIK',
    VERSION: '1.0.0',
    LAST_UPDATED: '2025-12-03'
};
