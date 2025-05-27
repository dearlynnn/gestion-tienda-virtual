// FUNCIÓN PARA REGISTRO
document.getElementById('registroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                usuario: usuario,
                password: password,
                activo: 1 // Puedes ajustar esto según tu lógica
            })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('mensaje').innerText = 'Registro exitoso!';
        } else {
            throw new Error(data.body || 'Error en el registro');
        }
    } catch (error) {
        document.getElementById('mensaje').innerText = error.message;
    }
});