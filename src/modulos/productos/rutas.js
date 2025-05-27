const express = require('express');
const respuesta = require('../../red/respuestas.js')

const router = express.Router();
const controlador =  require('./index.js')

router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.patch('/:id', editar);
router.delete('/:id', eliminar);


// Obtener todos los productos
async function todos (req, res, next) {
    try{
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    }catch(err){
        next(err);
    }
};

async function uno (req, res, next) {
    try{
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);
    }catch(err){
        next(err);
    }
};

// Controlador para eliminar un producto
async function eliminar(req, res, next) {
    try {
        const id = req.params.id; // Cambiamos req.body por req.params
        const items = await controlador.eliminar({ id }); // Pasamos el id al controlador
        if (items.affectedRows === 0) {
            throw new Error('Producto no encontrado o ya eliminado');
        }
        respuesta.success(req, res, 'Producto eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}


async function agregar (req, res, next) {
    try{
        const items = await controlador.agregar(req.body);
        if(req.body.id == 0){
            mensaje = 'Item guardado con éxito';
        }else{
            mensaje = 'Item actualizado con éxito';
        }
        respuesta.success(req, res, mensaje, 201);
    }catch(err){
        next(err);
    }
};

// Editar producto
async function editar(req, res, next) {
    try {
        const updatedItem = await controlador.editar(req.body);  // Verifica si los datos llegan correctamente
        if (updatedItem) {
            const mensaje = 'Item actualizado con éxito';
            return res.status(200).json({
                message: mensaje,
                data: updatedItem
            });
        } else {
            return res.status(404).json({ error: 'Item no encontrado' });
        }
    } catch (err) {
        next(err);
    }
}


module.exports = router;