"use strict";
const {    
    insertCliente, insertDatosJubilatorios, insertDocAcompaniada, getDatosJubilatorios, editDatoJubilatorio
} = require('../models/FormModel.js');

exports.insertarCliente = async(req, res) => {
    const data = req.body;    
    let estado = "iniciado" 
    try {
        // Inserta los datos en la tabla CLIENTE y obtiene el ID       
        const id_cliente = await insertCliente(data, estado);
        // Inserta los datos en la tabla DATOS_JUBILATORIOS y obtiene el ID
        const id_jubilacion = await insertDatosJubilatorios(data, id_cliente);

        // Inserta los datos en la tabla DOC_ACOMPANIADA si existe documental_acomp
        if (Array.isArray(data.documental_acomp)) {
            await insertDocAcompaniada(id_jubilacion, data.documental_acomp);
        }

        res.status(200).json({ message: 'Datos insertados exitosamente' });
    } catch (error) {       
        res.status(500).json({ error: 'Error al insertar datos' });
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


exports.editDatoJubilatorio = async (req, res) => {
    const { tabla, id, atr, dato } = req.params;
    if (!id || !atr || !dato) return res.status(400).json({ error: "Faltan datos necesarios para editar" });

    try {
        const updatedAnalisis = await editDatoJubilatorio(tabla, id, atr, dato);
        if (!updatedAnalisis) return res.status(404).json({ error: "No fue posible cambiar el dato" });
        return res.status(200).json({ message: "Dato editado exitosamente", data: updatedAnalisis });
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
};