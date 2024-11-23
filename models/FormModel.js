"use strict";
const conexion = require('../database/Conexion.js');

// Función para insertar en la tabla CLIENTE
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

    const result = await conexion.query(query, values);
    return result.rows[0].id_cliente;
}

// Función para insertar en la tabla DATOS_JUBILATORIOS
exports.insertDatosJubilatorios = async (data, id_cliente) => {
    const query = `
    INSERT INTO DATOS_JUBILATORIOS (tipo_jubilacion, serv_autonomo, serv_sinCargar, cargos_sinFigurar, ruralidad, mejor_cargo, diegep, 
    cargos_jerarquicos, caja_otraPcia, art_pendiente, cobro_sucursal,porcentaje, simultaneidad, antiguedad, ingreso_tramite, id_cliente)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id_jubilacion
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
        null,
        null,
        null,
        id_cliente
    ];

    const result = await conexion.query(query, values);
    return result.rows[0].id_jubilacion;
}

// Función para insertar en la tabla DOC_ACOMPANIADA
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

