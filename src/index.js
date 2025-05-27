const app = require('./app');


// Server
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando en el puerto", app.get("port"));
})

