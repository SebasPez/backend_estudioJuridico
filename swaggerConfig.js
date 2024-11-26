const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0', // Especificación de OpenAPI
        info: {
            title: 'API de Gestión de Jubilaciones', // Título del API
            version: '1.0.0', // Versión
            description: 'Documentación de la API',
            contact: {
                name: 'Cristian Mársico',
                email: 'cristianmarsico84@gmail.com',
            },
        },
        servers: [
            {
                url: process.env.MODO === 'developer' ? `http://localhost:${process.env.PORT_DEV}/api` : `https://tu-servidor.com/api`,
                description: process.env.MODO === "developer" ? 'Servidor de desarrollo' : 'Servidor de producción'
            }
        ]
    },
    apis: ['./routes/*.js'], // Ruta a tus archivos de rutas donde agregarás las anotaciones
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
