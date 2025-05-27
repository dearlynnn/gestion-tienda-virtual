// app.js
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const path = require('path');

const clientes = require('./modulos/clientes/rutas.js');
const usuarios = require('./modulos/usuarios/rutas.js');
const productos = require('./modulos/productos/rutas.js')
const auth = require('./modulos/auth/rutas.js');
const error = require('./red/errors.js');


const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración
app.set('port', config.app.port);

// Rutas
app.use('/api/clientes', clientes);
app.use('/api/usuarios', usuarios);
app.use('/api/productos', productos);
app.use('/api/productos/:id', productos);
app.use('/api/auth', auth);
app.use(error);

// Sirve archivos estáticos desde la carpeta src/app/pages
app.use(express.static(path.join(__dirname, '../app/views')));
app.use(express.static(path.join(__dirname, '../app')));

// Rutas para las pags
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/views/registro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/views/login.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/views/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/views/admin.html'));
});



module.exports = app;