"use strict";

const express = require('express');
const cookie = require('cookie-parser');
const dontev = require('dotenv');
const app = express();

const path = require('path');
//SETEAMOS VARIABLES DE ENTORNO
dontev.config({
    path: '.env'
})

//HACEMOS USO DE LAS COOKIES
app.use(cookie())
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) =>{
        res.send("hola mundo")
    })

app.use('/api', require('./routes/TareasRouter'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});