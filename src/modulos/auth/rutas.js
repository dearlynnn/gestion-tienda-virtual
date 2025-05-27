const express = require('express');
const respuesta = require('../../red/respuestas.js');
const controlador = require('./index.js');
const router = express.Router();

// No se requiere middleware de seguridad para el login
router.post('/login', login);

async function login(req, res, next) {
    try {
        const token = await controlador.login(req.body.usuario, req.body.password);
        respuesta.success(req, res, token, 200);
    } catch(err) {
        next(err);
    }
};

module.exports = router;
