document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token si es necesario
            localStorage.setItem('token', data.body); // Guarda el token en el almacenamiento local

            // Redirigir según las credenciales
            if (usuario === 'admin' && password === 'admin123') {
                window.location.href = 'admin.html'; // Redirige a la página admin.html
            } else {
                window.location.href = 'index.html'; // Redirige a la página principal
            }
        } else {
            throw new Error(data.body || 'Error en el inicio de sesión');
        }
    } catch (error) {
        document.getElementById('mensaje').innerText = error.message;
    }
});
