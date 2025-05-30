const db = require('../../DB/mysql.js');

const TABLA = 'products';
module.exports = function(dbInyectada) {

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql.js');
    }

    function todos () {
        return db.todos(TABLA);
    }
    
    function uno (id) {
        return db.uno(TABLA, id);
    }
    
    function agregar (body) {
        return db.agregar(TABLA, body);
    }

    function editar (body) {
        return db.editar(TABLA, body);
    }
    
    function eliminar (body) {
        return db.eliminar(TABLA, body);
    }

    return {
        todos, 
        uno,
        agregar,
        editar,
        eliminar 
    }
} 