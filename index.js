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



// Obtén el origen permitido desde el archivo .env
const allowedOrigin = process.env.ORIGIN;

// Configuración de CORS
app.use(cors({
    origin: (origin, callback) => {
        if (origin === allowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error('CORS error: No autorizado'));
        }
    },
    credentials: true
}));

app.options('*', cors());

app.use('/api', require('./routes/FormRouter.js'));
app.use('/api', require('./routes/ClienteRouter.js'));
app.use('/api', require('./routes/AnalisisRouter.js'));
app.use('/api', require('./routes/MovimientoRouter.js'));

const PORT = process.env.MODO === 'developer' ? process.env.PORT_DEV : process.env.PORT_PROD;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});