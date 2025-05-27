const db = require('../../DB/mysql.js');
const auth = require('../../auth');
const TABLA = 'auth';
const bcrypt = require('bcrypt');

module.exports = function(dbInyectada) {

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql.js');
    }

    async function login(usuario, password) {
        const data = await db.query(TABLA, { usuario: usuario });
    
        if (!data) {
            throw new Error('Usuario no encontrado');
        }
    
        return bcrypt.compare(password, data.password)
            .then(resultado => {
                if(resultado === true){
                    // generar un token
                    return auth.asignarToken({...data});
                } else {
                    throw new Error('Contraseña incorrecta');
                }
            });
    }
    
    async function agregar (data) {
        console.log(data)
        const authData = {
            id: data.id,
        }

        if(data.usuario){
            authData.usuario = data.usuario
        }

        if(data.password){
            authData.password = await bcrypt.hash(data.password.toString(), 5)
        }

        return db.agregar(TABLA, authData);
    }

    

    return {
        agregar,
        login
    }
}