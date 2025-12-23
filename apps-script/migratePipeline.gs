/**
 * Script de Migración - Pipeline de 18 a 22 columnas
 *
 * Ejecutar UNA SOLA VEZ desde Apps Script
 *
 * Estructura ANTERIOR (18 cols A-R):
 * ID, ContactoID, Nombre, Empresa, Email, Teléfono, Etapa, Valor, Probabilidad,
 * FechaContacto, FechaCierre, Estado, Fuente, Notas, Servicio, FechaActualizacion, Promotor, DriveFolder
 *
 * Estructura NUEVA (22 cols A-V):
 * ID, ContactoID, Nombre, Empresa, Email, Teléfono, NombreOportunidad, Etapa, Responsable,
 * Valor, Probabilidad, FechaCreacion, FechaCierreEsperada, FechaCierreReal, Estado, RazonPerdida,
 * Fuente, Servicio, Notas, Promotor, DriveFolder, FechaActualizacion
 */

function migratePipelineTo22Columns() {
  const SHEET_ID = '16uKHN5v6DhGCMjuyUaC84yIw9Fx-DKjayP2NRINrAJc';
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Pipeline');

  if (!sheet) {
    Logger.log('❌ Hoja Pipeline no encontrada');
    return;
  }

  // Obtener todos los datos (incluyendo header)
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  Logger.log(`📊 Filas encontradas: ${lastRow}, Columnas: ${lastCol}`);

  if (lastCol >= 22) {
    Logger.log('⚠️ La hoja ya tiene 22+ columnas. Verificar si ya fue migrada.');
    return;
  }

  if (lastRow < 2) {
    Logger.log('⚠️ No hay datos para migrar (solo header o vacía)');
    // Solo actualizar headers
    updateHeaders(sheet);
    return;
  }

  // Leer datos existentes (sin header)
  const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
  const oldData = dataRange.getValues();

  Logger.log(`📋 Migrando ${oldData.length} registros...`);

  // Transformar cada fila
  const newData = oldData.map((row, index) => {
    // Estructura anterior: [ID, ContactoID, Nombre, Empresa, Email, Teléfono, Etapa, Valor, Probabilidad, FechaContacto, FechaCierre, Estado, Fuente, Notas, Servicio, FechaActualizacion, Promotor, DriveFolder]
    const [id, contactoId, nombre, empresa, email, telefono, etapa, valor, probabilidad, fechaContacto, fechaCierre, estado, fuente, notas, servicio, fechaActualizacion, promotor, driveFolder] = row;

    // Mapear etapas antiguas a nuevas
    let nuevaEtapa = mapearEtapa(etapa);

    // Mapear estados antiguos a nuevos
    let nuevoEstado = mapearEstado(estado);

    // Calcular probabilidad basada en nueva etapa si no tiene valor
    let nuevaProbabilidad = probabilidad || getProbabilidadPorEtapa(nuevaEtapa);

    // Estructura nueva: [ID, ContactoID, Nombre, Empresa, Email, Teléfono, NombreOportunidad, Etapa, Responsable, Valor, Probabilidad, FechaCreacion, FechaCierreEsperada, FechaCierreReal, Estado, RazonPerdida, Fuente, Servicio, Notas, Promotor, DriveFolder, FechaActualizacion]
    return [
      id,                                    // A: ID
      contactoId,                            // B: ContactoID
      nombre,                                // C: Nombre
      empresa,                               // D: Empresa
      email,                                 // E: Email
      telefono,                              // F: Teléfono
      `${empresa} - ${servicio || 'Proyecto'}`, // G: NombreOportunidad (generado)
      nuevaEtapa,                            // H: Etapa (mapeada)
      'Mauricio',                            // I: Responsable (default)
      valor,                                 // J: Valor
      nuevaProbabilidad,                     // K: Probabilidad
      fechaContacto,                         // L: FechaCreacion
      fechaCierre,                           // M: FechaCierreEsperada
      '',                                    // N: FechaCierreReal (vacío)
      nuevoEstado,                           // O: Estado (mapeado)
      '',                                    // P: RazonPerdida (vacío)
      fuente,                                // Q: Fuente
      servicio,                              // R: Servicio
      notas,                                 // S: Notas
      promotor,                              // T: Promotor
      driveFolder,                           // U: DriveFolder
      fechaActualizacion                     // V: FechaActualizacion
    ];
  });

  // Limpiar datos existentes (excepto header)
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clear();
  }

  // Actualizar headers
  updateHeaders(sheet);

  // Escribir nuevos datos
  if (newData.length > 0) {
    sheet.getRange(2, 1, newData.length, 22).setValues(newData);
  }

  Logger.log(`✅ Migración completada: ${newData.length} registros actualizados a 22 columnas`);
}

/**
 * Actualizar headers de Pipeline
 */
function updateHeaders(sheet) {
  const headers = [
    'ID', 'ContactoID', 'Nombre', 'Empresa', 'Email', 'Teléfono',
    'NombreOportunidad', 'Etapa', 'Responsable', 'Valor', 'Probabilidad',
    'FechaCreacion', 'FechaCierreEsperada', 'FechaCierreReal', 'Estado',
    'RazonPerdida', 'Fuente', 'Servicio', 'Notas', 'Promotor', 'DriveFolder',
    'FechaActualizacion'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  Logger.log('📝 Headers actualizados');
}

/**
 * Mapear etapas antiguas a nuevas
 */
function mapearEtapa(etapaAntigua) {
  const mapeo = {
    'Contacto': 'Contactado',
    'Propuesta': 'Propuesta Enviada',
    'Negociación': 'Negociación',
    'Cierre': 'Cierre Verbal'
  };

  return mapeo[etapaAntigua] || etapaAntigua || 'Lead';
}

/**
 * Mapear estados antiguos a nuevos
 */
function mapearEstado(estadoAntiguo) {
  const mapeo = {
    'Activo': 'Abierta',
    'Ganado': 'Ganada',
    'Perdido': 'Perdida',
    'Pausado': 'Abierta'
  };

  return mapeo[estadoAntiguo] || estadoAntiguo || 'Abierta';
}

/**
 * Obtener probabilidad por etapa
 */
function getProbabilidadPorEtapa(etapa) {
  const probabilidades = {
    'Lead': 10,
    'Contactado': 15,
    'Calificado': 25,
    'Propuesta Enviada': 40,
    'Negociación': 60,
    'Cierre Verbal': 80,
    'Contrato Firmado': 95,
    'Ganado': 100,
    'Perdido': 0
  };

  return probabilidades[etapa] || 10;
}
