"use strict";

const dontev = require('dotenv');
dontev.config({ path: '.env' });

require('./database/Conexion');
const express = require('express');
const cookie = require('cookie-parser');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swaggerConfig');

const http = require('http'); // Añadir http
const socketIo = require('socket.io'); // Importar socket.io
const { isObject } = require('util');

const app = express();

// Usamos las cookies
app.use(cookie());

// Configuración de CORS
const allowAnyLocalhost = process.env.ALLOW_ANY_LOCALHOST === 'true';
const allowedOrigins = [
    process.env.ORIGIN1,  // Producción
    allowAnyLocalhost ? /^http:\/\/localhost(:\d+)?$/ : null  // Desarrollo
].filter(Boolean);  // Filtramos los valores nulos

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como desde herramientas de prueba) o desde orígenes permitidos
        if (!origin || allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
            return callback(null, true);
        }
        callback(new Error(`Error de CORS. Origen no autorizado: ${origin}`));
    },
    credentials: true,
    exposedHeaders: ['Content-Length', 'Authorization']
}));
app.options('*', cors());

// Middleware para JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Creamos el servidor HTTP para WebSocket
const server = http.createServer(app);

// Configuramos WebSocket con socket.io
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Rutas
app.use('/api', require('./routes/FormRouter.js')(io));
app.use('/api', require('./routes/AuthRouter.js'));
app.use('/api', require('./routes/UserRoutes.js'));
app.use('/api', require('./routes/ClienteRouter.js')(io));
app.use('/api', require('./routes/AnalisisRouter.js')(io));
app.use('/api', require('./routes/MovimientoRouter.js')(io));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Selección del puerto según el modo
const PORT_URL = process.env.MODO === 'developer' ? process.env.PORT_DEV : process.env.PORT_PROD;
server.listen(PORT_URL, () => {
    console.log(`Servidor escuchando en el puerto ${PORT_URL}`);
});
console.log(`Documentación disponible en {URL}/api-docs`);
