"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Inserta los datos de un cliente en la base de datos y devuelve el ID del cliente insertado.
 * 
 * Este método realiza la inserción de los datos del cliente en la tabla `CLIENTE` de la base de datos. 
 * Los datos insertados incluyen nombre, CUIL, edad, localidad, celular, correo electrónico, clave ABC, 
 * estado civil, código postal y estado. Devuelve el `id_cliente` del nuevo cliente insertado.
 * 
 * @param {Object} data - Los datos del cliente a insertar.
 * @param {string} estado - El estado del cliente (por defecto, "pendiente").
 * @returns {Promise<number>} - Una promesa que se resuelve con el `id_cliente` del cliente insertado.
 * @throws {Error} - Si ocurre un error durante la inserción de datos en la base de datos.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * insertCliente({ nombre: "Juan Pérez", cuil: "20-12345678-9" }, "activo")
 *   .then(id_cliente => {
 *     console.log("ID del cliente:", id_cliente);
 *   })
 *   .catch(error => {
 *     console.error("Error al insertar cliente:", error);
 *   });
 */
exports.insertCliente = async (data, estado) => {
   
    const query = `
    INSERT INTO CLIENTE (nombre, cuil, edad, localidad, celular, mail, clave_abc, estado_civil, cod_postal, estado) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_cliente
  `;
    const values = [
        data.nombre,
        data.cuil,
        data.edad,
        data.localidad,
        data.celular,
        data.mail,
        data.clave_abc || null,
        data.estado_civil || null,
        data.cod_postal || null,
        estado
    ];
   
    try {
        const result = await conexion.query(query, values);       
        return result.rows[0].id_cliente;
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        throw error; // Lanza el error para que el controlador lo maneje
    }
}

/**
 * Inserta los datos jubilatorios de un cliente en la base de datos y devuelve el ID de jubilación.
 * 
 * Este método inserta los datos relacionados con la jubilación de un cliente en la tabla `DATOS_JUBILATORIOS`. 
 * Los datos incluyen tipo de jubilación, servicios, cargos, y otros parámetros asociados a la jubilación del cliente.
 * Devuelve el `id_jubilacion` correspondiente al cliente insertado.
 * 
 * @param {Object} data - Los datos jubilatorios del cliente a insertar.
 * @param {number} id_cliente - El ID del cliente al que pertenecen los datos jubilatorios.
 * @returns {Promise<number>} - Una promesa que se resuelve con el `id_jubilacion` de los datos jubilatorios insertados.
 * @throws {Error} - Si ocurre un error durante la inserción de los datos jubilatorios en la base de datos.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * insertDatosJubilatorios({ tipo_jubilacion: "Jubilación ordinaria" }, 1)
 *   .then(id_jubilacion => {
 *     console.log("ID de jubilación:", id_jubilacion);
 *   })
 *   .catch(error => {
 *     console.error("Error al insertar datos jubilatorios:", error);
 *   });
 */
exports.insertDatosJubilatorios = async (data, id_cliente) => {
    const query = `
    INSERT INTO DATOS_JUBILATORIOS (tipo_jubilacion, serv_autonomo, serv_sinCargar, cargos_sinFigurar, ruralidad, mejor_cargo, diegep, 
    cargos_jerarquicos, caja_otraPcia, art_pendiente, cobro_sucursal,porcentaje, clave_afip, simultaneidad, antiguedad, ingreso_tramite, id_cliente)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id_jubilacion
  `;
    const values = [      
        data.tipo_jubilacion,
        data.serv_autonomo || null,
        data.serv_sinCargar || null,
        data.cargos_sinFigurar || null,
        data.ruralidad || null,
        data.mejorCargo || null,
        data.diegep || null,
        data.cargos_jerarquicos || null,
        data.caja_otraPcia || null,
        data.art_pendiente || null,
        data.cobro_sucursal || null,
        null,
        data.clave_afip || null,
        null,
        null,
        null,
        id_cliente
    ];

    const result = await conexion.query(query, values);
    return result.rows[0].id_jubilacion;
}

/**
 * Inserta documentos acompañantes asociados a una jubilación en la base de datos.
 * 
 * Este método verifica si el arreglo `documental_acomp` no está vacío y, si es así, inserta cada documento 
 * en la tabla `DOC_ACOMPANIADA`, asociándolo con la jubilación proporcionada.
 * 
 * @param {number} id_jubilacion - El ID de la jubilación a la que se asociarán los documentos acompañantes.
 * @param {string[]} documental_acomp - Un arreglo de documentos acompañantes a insertar.
 * @throws {Error} - Si ocurre un error durante la inserción de los documentos en la base de datos.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * insertDocAcompaniada(1, ["documento1.pdf", "documento2.pdf"])
 *   .then(() => {
 *     console.log("Documentos insertados correctamente.");
 *   })
 *   .catch(error => {
 *     console.error("Error al insertar documentos:", error);
 *   });
 */
exports.insertDocAcompaniada = async (id_jubilacion, documental_acomp) => {
    // Verifica si el arreglo no está vacío
    if (documental_acomp && documental_acomp.length > 0) {
        const query = `
      INSERT INTO DOC_ACOMPANIADA (id_jubilacion, documental_acomp) VALUES ($1, $2)
    `;
        // Realiza la inserción para cada elemento en el arreglo documental_acomp
        for (const doc of documental_acomp) {
            const values = [
                id_jubilacion,
                doc || null  // Reemplaza valores vacíos por null
            ];
            await conexion.query(query, values);
        }
    }
}

/**
 * Obtiene los datos jubilatorios de un cliente desde la base de datos.
 * 
 * Este método consulta la base de datos para obtener los datos jubilatorios asociados a un cliente,
 * identificados por su `id_cliente`. La consulta también incluye los documentos acompañantes, 
 * que se concatenan en una lista separada por comas.
 * Si se encuentran registros para ese cliente, se devuelve una lista de los resultados.
 * Si no se encuentran datos jubilatorios, se devuelve una lista vacía.
 * 
 * @param {number} id_cliente - El ID del cliente cuya información jubilatoria se busca.
 * @returns {Promise<Array>} - Una promesa que se resuelve con un arreglo de objetos que contiene los datos jubilatorios.
 * Si no se encuentran datos jubilatorios, la promesa se resuelve con una lista vacía.
 * @throws {Error} - Si ocurre un error durante la consulta a la base de datos.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * getDatosJubilatorios(1)
 *   .then(datos => {
 *     console.log("Datos jubilatorios:", datos);
 *   })
 *   .catch(error => {
 *     console.error("Error al obtener datos jubilatorios:", error);
 *   });
 */
exports.getDatosJubilatorios = (id_cliente) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT
            c.*,       
            dj.*,
            STRING_AGG(da.documental_acomp, ', ' ORDER BY da.documental_acomp) AS documental_acomp
            FROM cliente c
            JOIN datos_jubilatorios dj ON c.id_cliente = dj.id_cliente
            LEFT JOIN doc_acompaniada da ON dj.id_jubilacion = da.id_jubilacion
            WHERE c.id_cliente = ${id_cliente}
            GROUP BY c.id_cliente, dj.id_jubilacion`;
        conexion.query(sql, (err, resultados) => {
            if (err) return reject({ status: 500, message: 'Error al obtener los datos jubilatorios' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve solo las filas
            resolve([]);  // Devuelve una lista vacía si no hay tareas
        });
    });
};

/**
 * Edita un dato específico de un registro en la base de datos.
 * 
 * Esta función actualiza un atributo de un registro en una de las tablas de la base de datos, como `datos_jubilatorios` o `cliente`.
 * Dependiendo de la tabla, la función ajusta la consulta SQL para actualizar el atributo indicado con el nuevo valor.
 * Si la operación es exitosa, devuelve el registro actualizado con el ID y el valor del atributo editado.
 * 
 * @param {string} tabla - El nombre de la tabla en la que se actualizará el dato.
 * @param {number} id - El ID del registro a actualizar.
 * @param {string} atr - El nombre del atributo a editar.
 * @param {string} dato - El nuevo valor del atributo.
 * @returns {Object} - El objeto con el ID del registro y el valor actualizado del atributo.
 * @throws {Error} - Si ocurre un error en la consulta SQL o en la actualización del dato.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * editDatoJubilatorio('datos_jubilatorios', 1, 'clave_afip', '12345678')
 *   .then(updatedRecord => {
 *     console.log("Registro actualizado:", updatedRecord);
 *   })
 *   .catch(error => {
 *     console.error("Error al actualizar el dato:", error);
 *   });
 */
exports.editDatoJubilatorio = async (tabla, id, atr, dato) => {
    let query; 

    if (tabla === 'datos_jubilatorios') {
        query = `
            UPDATE ${tabla}
            SET ${atr} = $1      
            WHERE id_jubilacion = $2
            RETURNING id_jubilacion, ${atr};
        `;
    } else {
        query = `
            UPDATE ${tabla}
            SET ${atr} = $1      
            WHERE id_cliente = $2
            RETURNING id_cliente, ${atr};
        `;
    }

    const values = [dato, id];

    try {
        const result = await conexion.query(query, values);
        return result.rows[0]; // Devuelve el resultado.
    } catch (error) {       
        throw error; // Propaga el error para manejarlo donde se llame esta función.
    }
};

