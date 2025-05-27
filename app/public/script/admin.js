document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    // Agregar evento al formulario para agregar productos
    document.getElementById('form-add-producto').addEventListener('submit', agregarProducto);
});

// Función para cargar los productos de la base de datos
function cargarProductos() {
    fetch('/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(data => { 
            const productos = data.body; 
            const productosList = document.getElementById('productos-list');
            productosList.innerHTML = '';

            if (productos.length === 0) {
                productosList.innerHTML = '<p>No hay productos disponibles.</p>';
            }

            productos.forEach(producto => {
                // Crear un div para cada producto
                const productDiv = document.createElement('div');
                productDiv.classList.add('producto-item'); // Añadir clase para aplicar estilos
                productDiv.innerHTML = `
                    <div id="producto-${producto.id}">
                        <h3>${producto.nombre}</h3>
                        <p>Categoría: ${producto.categoria}</p>
                        <p>Precio: $${producto.precio}</p>
                        <p>Cantidad disponible: ${producto.cantidad_disponible}</p>
                        <p>${producto.descripcion}</p>
                        <img src="${producto.imagen_url}" alt="${producto.nombre}" style="max-width: 100px;">
                        <div class="product-actions">
                            <button class="btn-2" onclick="mostrarFormularioEditar(${producto.id})">Editar</button>
                            <button class="btn-2" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        </div>
                        <div id="edit-form-${producto.id}" style="display:none;">
                            <form onsubmit="guardarEdicionProducto(event, ${producto.id})">
                                <input type="text" id="edit-nombre-${producto.id}" value="${producto.nombre}" required><br>
                                <input type="text" id="edit-categoria-${producto.id}" value="${producto.categoria}" required><br>
                                <input type="number" id="edit-precio-${producto.id}" value="${producto.precio}" required><br>
                                <input type="number" id="edit-cantidad_disponible-${producto.id}" value="${producto.cantidad_disponible}" required><br>
                                <textarea id="edit-descripcion-${producto.id}" required>${producto.descripcion}</textarea><br>
                                <input type="text" id="edit-imagen_url-${producto.id}" value="${producto.imagen_url}" required><br>
                                <button type="submit" class="btn-2" >Guardar</button>
                                <button type="button" class="btn-2"  onclick="cancelarEdicion(${producto.id})">Cancelar</button>
                            </form>
                        </div>
                    </div>
                `;
                productosList.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('Hubo un problema con la carga de productos:', error);
            const productosList = document.getElementById('productos-list');
            productosList.innerHTML = '<p>Error al cargar productos.</p>';
        });
}

// Función para mostrar el formulario de edición directamente en el producto
function mostrarFormularioEditar(id) {
    document.querySelector(`#producto-${id} .product-actions`).style.display = 'none';
    document.getElementById(`edit-form-${id}`).style.display = 'block';
}

// Función para guardar los cambios del producto editado
const guardarEdicionProducto = async (event, id) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const productoEditado = {
        id: id, // Aseguramos que el ID esté en el cuerpo de la solicitud
        nombre: document.getElementById(`edit-nombre-${id}`).value,
        categoria: document.getElementById(`edit-categoria-${id}`).value,
        precio: parseFloat(document.getElementById(`edit-precio-${id}`).value),
        cantidad_disponible: parseInt(document.getElementById(`edit-cantidad_disponible-${id}`).value),
        descripcion: document.getElementById(`edit-descripcion-${id}`).value,
        imagen_url: document.getElementById(`edit-imagen_url-${id}`).value
    };

    try {
        const respuesta = await fetch(`/api/productos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoEditado)
        });

        if (!respuesta.ok) {
            throw new Error('Error al editar el producto');
        }

        const datos = await respuesta.json();
        console.log('Producto actualizado:', datos);
        cargarProductos();  // Recargar la lista de productos después de la edición
    } catch (error) {
        console.error('Hubo un problema con la edición del producto:', error);
    }
};



// Función para cancelar la edición
function cancelarEdicion(id) {
    document.querySelector(`#producto-${id} .product-actions`).style.display = 'block';
    document.getElementById(`edit-form-${id}`).style.display = 'none';
}

// Función para agregar un nuevo producto
function agregarProducto(e) {
    e.preventDefault();

    const nuevoProducto = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        precio: document.getElementById('precio').value,
        cantidad_disponible: document.getElementById('cantidad_disponible').value,
        descripcion: document.getElementById('descripcion').value,
        imagen_url: document.getElementById('imagen_url').value
    };

    fetch('/api/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar el producto');
        }
        return response.json();
    })
    .then(() => {
        cargarProductos();  // Recargar la lista de productos
        document.getElementById('form-add-producto').reset();  // Limpiar el formulario de agregar
    })
    .catch(error => {
        console.error('Hubo un problema con la adición del producto:', error);
    });
}

async function eliminarProducto(id) {
    try {
        const respuesta = await fetch(`/api/productos/${id}`, {
            method: 'DELETE', // Cambiamos a DELETE
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al eliminar el producto');
        }

        const datos = await respuesta.json();
        console.log('Producto eliminado:', datos);
        cargarProductos(); // Recargar la lista de productos después de la eliminación
    } catch (error) {
        console.error('Hubo un problema con la eliminación del producto:', error);
    }
}