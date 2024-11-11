"use strict";
const {
    get, borrar, agregar, editar
} = require('../models/AnalisisModel.js');

exports.get = async (req, res) => {
    const { id_cliente } = req.params;  
    try {
        let response = await get(id_cliente);       
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "Aún no se ha realizado ningún análisis" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

exports.borrar = async (req, res) => {
    const { id_analisis } = req.params;    
    try {
        let response = await borrar(id_analisis, res)
       
        if (response) return res.status(200).json(`Analisis borrado con éxito`);
        else return res.status(404).json({ error: "Error: No se ha podido eliminar" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};


exports.agregar = async (req, res) => {
    const { tipo_analisis, id_cliente } = req.body;
    let estado = "iniciado";
    try {       
        const id = await agregar(tipo_analisis, estado, id_cliente);
        if (!id) return res.status(404).json({ message: "El análisis no se puedo agregar" });
        return res.status(200).json({ message: `Datos insertados exitosamente a la persona con id: ${id}` });
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).json({ message: 'Error se servidor' });
    }
}

exports.editar = async (req, res) => {
    const { id_analisis, estado } = req.params;
   
    if (!id_analisis || !estado) return res.status(400).json({ message: "Faltan datos necesarios para editar el análisis" });
    
    try {
        const updatedAnalisis = await editar(id_analisis, estado);
        if (!updatedAnalisis) return res.status(404).json({ message: "El estado no se pudo cambiar" });
        return res.status(200).json({ message: "Dato editado exitosamente", data: updatedAnalisis });
    } catch (error) {
        console.error("Error al editar:", error);
        res.status(500).json({ message: "de servidor" });
    }
};