"use strict";
const {    
    insertCliente, insertDatosJubilatorios, insertDocAcompaniada, getDatosJubilatorios
} = require('../models/FormModel.js');

exports.insertarCliente = async(req, res) => {
    const data = req.body;  
    try {
        // Inserta los datos en la tabla CLIENTE y obtiene el ID       
        const id_cliente = await insertCliente(data);
        // Inserta los datos en la tabla DATOS_JUBILATORIOS y obtiene el ID
        const id_jubilacion = await insertDatosJubilatorios(data, id_cliente);

        // Inserta los datos en la tabla DOC_ACOMPANIADA si existe documental_acomp
        if (Array.isArray(data.documental_acomp)) {
            await insertDocAcompaniada(id_jubilacion, data.documental_acomp);
        }

        res.status(200).json({ message: 'Datos insertados exitosamente' });
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).json({ message: 'Error al insertar datos' });
    }
}

exports.getDatosJubilatorios = async (req, res) => {
    const { id_cliente } = req.params;    
    try {
        let response = await getDatosJubilatorios(id_cliente);
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "Aún no se han registrado datos jubilatorios de dicha persona" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};