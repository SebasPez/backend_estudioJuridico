"use strict";

const express = require('express');
const cookie = require('cookie-parser');
const dontev = require('dotenv');
const cors = require('cors');

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

const allowAnyLocalhost = process.env.ALLOW_ANY_LOCALHOST === 'true';

app.use(cors({
    origin: allowAnyLocalhost ? /^http:\/\/localhost(:\d+)?$/ : function (origin, callback) {
        if (!origin) return callback(null, 'http://localhost');

        // Agrega lógica adicional aquí si es necesario
        return callback("Error de CORS origin: " + origin + " No autorizado");
    },
    credentials: true,
    exposedHeaders: allowAnyLocalhost ? null : ['Content-Length', 'Authorization'], // Ajusta según tus necesidades
}));

app.options('*', cors());

app.use('/api', require('./routes/FormRouter.js'));
app.use('/api', require('./routes/ClienteRouter.js'));

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});