"use strict";

const express = require('express');
const cookie = require('cookie-parser');
const app = express();

//HACEMOS USO DE LAS COOKIES
app.use(cookie())
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) =>{
        res.send("hola mundo")
    })

app.use('/api', require('./routes/TareasRouter'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});