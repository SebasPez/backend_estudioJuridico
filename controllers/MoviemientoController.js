"use strict";
const {
    get, agregar
} = require('../models/MovimientoModel.js');

exports.get = async (req, res) => {
    const { id_cliente } = req.params;  
    try {
        let response = await get(id_cliente);
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "Aún no se han realizado movimientos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

// exports.borrar = async (req, res) => {
//     const { id_analisis } = req.params;
//     try {
//         let response = await borrar(id_analisis, res)

//         if (response) return res.status(200).json(`Analisis borrado con éxito`);
//         else return res.status(404).json({ error: "Error: No se ha podido eliminar" })
//     } catch (error) {
//         return res.status(500).json({ error: "Error de servidor" });
//     }
// };

exports.agregar = async (req, res) => {
    const { descripcion, id_cliente } = req.body;  
    try {
        const id = await agregar(descripcion, id_cliente);
        res.status(200).json({ message: `Movimiente creado exitosamente` });
    } catch (error) {       
        res.status(500).json({ error: 'Error al insertar datos' });
    }
}