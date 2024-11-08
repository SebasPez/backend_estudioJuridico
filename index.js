"use strict";

const express = require('express');
const cookie = require('cookie-parser');
const dontev = require('dotenv');
const cors = require('cors');

const app = express();

const path = require('path');
dontev.config({
    path: '.env'
})

app.use(cookie())
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

const allowAnyLocalhost = process.env.ALLOW_ANY_LOCALHOST === 'true';

app.use(cors({
    origin: allowAnyLocalhost ? /^http:\/\/localhost(:\d+)?$/ : function (origin, callback) {
        if (!origin) return callback(null, 'http://localhost');
        return callback("Error de CORS origin: " + origin + " No autorizado");
    },
    credentials: true,
    exposedHeaders: allowAnyLocalhost ? null : ['Content-Length', 'Authorization'], // Ajusta según tus necesidades
}));

app.options('*', cors());

app.use('/api', require('./routes/FormRouter.js'));
app.use('/api', require('./routes/ClienteRouter.js'));
app.use('/api', require('./routes/AnalisisRouter.js'));

const PORT = process.env.MODO === 'developer' ? process.env.PORT_DEV : process.env.PORT_PROD;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});