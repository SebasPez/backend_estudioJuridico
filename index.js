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

const allowedOrigins = [
    process.env.ORIGIN1,
    process.env.ORIGIN2,
    process.env.ORIGIN3,
    process.env.ORIGIN4,
];

console.log("Allowed Origins:", allowedOrigins);
console.log("Allow Any Localhost:", process.env.ALLOW_ANY_LOCALHOST);

app.use(cors({
    origin: (origin, callback) => {
        console.log("Origin received:", origin);
        if (process.env.ALLOW_ANY_LOCALHOST === 'true' && origin && origin.startsWith('http://localhost')) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('No permitido por la política CORS'));
    }
}));

app.use('/api', require('./routes/FormRouter.js'));
app.use('/api', require('./routes/ClienteRouter.js'));
app.use('/api', require('./routes/AnalisisRouter.js'));

const PORT = process.env.MODO === 'developer' ? process.env.PORT_DEV : process.env.PORT_PROD;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});