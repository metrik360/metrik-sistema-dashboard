/**
 * MéTRIK Sistema - Google Apps Script API Backend
 *
 * This script provides a REST API for the MéTRIK dashboard system
 * without requiring OAuth popups for each user.
 *
 * @version 1.1.0
 * @author Claude Code
 */

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
  SHEET_ID: '16uKHN5v6DhGCMjuyUaC84yIw9Fx-DKjayP2NRINrAJc',
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
  ALLOWED_ORIGINS: [
    'https://system.metrik.com.co',
    'https://metrik360.github.io'
  ]
};

// ========================================
// MAIN HANDLER - doGet & doPost
// ========================================

/**
 * Main entry point for GET requests
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Main entry point for POST requests
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Handle all HTTP requests
 */
function handleRequest(e) {
  try {
    // Enable CORS
    const origin = e.parameter.origin || e.headers?.origin;

    // Parse POST data if exists, otherwise use GET parameters
    let postData = {};
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        return createResponse({ error: 'Invalid JSON in request body' }, 400, origin);
      }
    } else {
      // Use GET parameters as fallback (for testing)
      postData = e.parameter;
    }

    // Get action and sheetName from POST body or GET parameters
    const action = postData.action || e.parameter.action;
    const sheetName = postData.sheet || e.parameter.sheet;

    // Route to appropriate handler
    let result;

    switch(action) {
      case 'authenticate':
        result = handleAuthentication(postData);
        break;

      case 'read':
        result = handleRead(sheetName, postData.range || 'A2:Z');
        break;

      case 'write':
        result = handleWrite(sheetName, postData.values);
        break;

      case 'update':
        result = handleUpdate(sheetName, postData.range, postData.values);
        break;

      case 'delete':
        result = handleDelete(sheetName, parseInt(postData.rowNumber));
        break;

      default:
        result = { error: 'Invalid action. Use: authenticate, read, write, update, delete' };
        return createResponse(result, 400, origin);
    }

    return createResponse(result, 200, origin);

  } catch (error) {
    Logger.log('Error in handleRequest: ' + error.message);
    return createResponse({
      error: error.message,
      stack: error.stack
    }, 500, origin);
  }
}

// ========================================
// AUTHENTICATION
// ========================================

/**
 * Authenticate user with Email + PIN
 */
function handleAuthentication(data) {
  const { email, pin } = data;

  if (!email || !pin) {
    return { success: false, error: 'Email and PIN are required' };
  }

  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEETS.USUARIOS);
    const dataRange = sheet.getRange('A2:K' + sheet.getLastRow());
    const usuarios = dataRange.getValues();

    // Normalize email for comparison
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email (case-insensitive)
    const userRow = usuarios.find(row =>
      row[2] && row[2].toString().toLowerCase().trim() === normalizedEmail
    );

    if (!userRow) {
      return { success: false, error: 'Credenciales incorrectas' };
    }

    const [id, nombre, userEmail, userPIN, rol, estado, empresaId, permisos] = userRow;

    // Validate PIN
    if (userPIN.toString() !== pin.toString()) {
      return { success: false, error: 'Credenciales incorrectas' };
    }

    // Validate status
    if (estado !== 'Activo') {
      return { success: false, error: 'Usuario inactivo. Contacta al administrador.' };
    }

    // Update last activity
    const rowIndex = usuarios.indexOf(userRow) + 2; // +2 for header and 0-index
    const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    sheet.getRange('K' + rowIndex).setValue(now);

    // Parse permisos
    let permisosObj = {};
    try {
      if (permisos) {
        permisosObj = JSON.parse(permisos);
      }
    } catch (e) {
      Logger.log('Could not parse permisos: ' + e);
    }

    return {
      success: true,
      user: {
        id: id,
        email: userEmail,
        nombre: nombre,
        rol: rol,
        empresaId: empresaId || null,
        permisos: permisosObj
      }
    };

  } catch (error) {
    Logger.log('Error in handleAuthentication: ' + error.message);
    return { success: false, error: 'Error al autenticar' };
  }
}

// ========================================
// CRUD OPERATIONS
// ========================================

/**
 * Helper function to get actual sheet name from CONFIG
 */
function getActualSheetName(sheetName) {
  if (!sheetName) {
    return null;
  }

  // Normalize sheet name (remove accents and uppercase for lookup)
  const normalizedName = sheetName
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents

  // Find the actual sheet name from CONFIG
  for (const [key, value] of Object.entries(CONFIG.SHEETS)) {
    if (key === normalizedName) {
      return value;
    }
  }

  return null;
}

/**
 * Read data from a sheet
 */
function handleRead(sheetName, range = 'A2:Z') {
  try {
    const actualSheetName = getActualSheetName(sheetName);

    if (!actualSheetName) {
      return { error: 'Invalid sheet name: ' + sheetName };
    }

    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(actualSheetName);

    if (!sheet) {
      return { error: 'Sheet not found: ' + actualSheetName };
    }

    const dataRange = sheet.getRange(range + sheet.getLastRow());
    const values = dataRange.getValues();

    // Filter out empty rows
    const filteredValues = values.filter(row => row.some(cell => cell !== ''));

    return {
      success: true,
      data: filteredValues
    };

  } catch (error) {
    Logger.log('Error in handleRead: ' + error.message);
    return { error: error.message };
  }
}

/**
 * Write data to a sheet (append new rows)
 */
function handleWrite(sheetName, values) {
  try {
    const actualSheetName = getActualSheetName(sheetName);

    if (!actualSheetName) {
      return { error: 'Invalid sheet name: ' + sheetName };
    }

    if (!values || !Array.isArray(values)) {
      return { error: 'Values must be an array' };
    }

    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(actualSheetName);

    if (!sheet) {
      return { error: 'Sheet not found: ' + actualSheetName };
    }

    // Append rows
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);

    return {
      success: true,
      message: 'Data written successfully',
      rowsAdded: values.length
    };

  } catch (error) {
    Logger.log('Error in handleWrite: ' + error.message);
    return { error: error.message };
  }
}

/**
 * Update existing data in a sheet
 */
function handleUpdate(sheetName, range, values) {
  try {
    const actualSheetName = getActualSheetName(sheetName);

    if (!actualSheetName) {
      return { error: 'Invalid sheet name: ' + sheetName };
    }

    if (!range) {
      return { error: 'Range is required' };
    }

    if (!values || !Array.isArray(values)) {
      return { error: 'Values must be an array' };
    }

    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(actualSheetName);

    if (!sheet) {
      return { error: 'Sheet not found: ' + actualSheetName };
    }

    // Update range
    const targetRange = sheet.getRange(range);
    targetRange.setValues(values);

    return {
      success: true,
      message: 'Data updated successfully'
    };

  } catch (error) {
    Logger.log('Error in handleUpdate: ' + error.message);
    return { error: error.message };
  }
}

/**
 * Delete a row from a sheet
 */
function handleDelete(sheetName, rowNumber) {
  try {
    const actualSheetName = getActualSheetName(sheetName);

    if (!actualSheetName) {
      return { error: 'Invalid sheet name: ' + sheetName };
    }

    if (!rowNumber || rowNumber < 2) {
      return { error: 'Invalid row number (must be >= 2)' };
    }

    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(actualSheetName);

    if (!sheet) {
      return { error: 'Sheet not found: ' + actualSheetName };
    }

    // Delete the row
    sheet.deleteRow(rowNumber);

    return {
      success: true,
      message: 'Row deleted successfully',
      rowNumber: rowNumber
    };

  } catch (error) {
    Logger.log('Error in handleDelete: ' + error.message);
    return { error: error.message };
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Create HTTP response with CORS headers
 */
function createResponse(data, statusCode = 200, origin = null) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);

  // Add CORS headers
  if (origin && CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    // Note: Apps Script doesn't support custom headers in ContentService
    // CORS is handled automatically for web apps deployed as "accessible to anyone"
  }

  return output;
}
