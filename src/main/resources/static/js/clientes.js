/* ==================== FUNCIONES DE CLIENTES ==================== */

let editingClienteId = null;
let editingMascotaId = null;

// Inicializar página
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verificar autenticación
        const user = await getCurrentUser();
        app.currentUserId = user.id;
        app.currentUsername = user.username;
        
        // Cargar clientes
        cargarClientes();
        
        // Configurar listeners
        document.getElementById('btn-new-client').addEventListener('click', abrirModalNuevoCliente);
        document.getElementById('form-cliente').addEventListener('submit', guardarCliente);
        document.getElementById('form-mascota').addEventListener('submit', guardarMascota);
    } catch (error) {
        console.error('Error al iniciar:', error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            window.location.href = '/login.html';
        }
    }
});

// Cargar clientes
async function cargarClientes() {
    try {
        const clientes = await getClientes();
        const container = document.getElementById('clientes-container');
        
        if (clientes && clientes.length > 0) {
            container.innerHTML = clientes.map(cliente => construirClienteCard(cliente)).join('');
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Sin clientes registrados</h3>
                    <p>Crea un nuevo cliente para comenzar</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando clientes:', error);
        const container = document.getElementById('clientes-container');
        container.innerHTML = `
            <div class="empty-state">
                <h3>Error cargando clientes</h3>
                <p>${error.message}</p>
            </div>
        `;
        mostrarNotificacion('Error', 'Error al cargar los clientes');
    }
}

// Modales de cliente
function abrirModalNuevoCliente() {
    editingClienteId = null;
    document.getElementById('modal-cliente-title').innerText = 'Nuevo Cliente';
    document.getElementById('form-cliente').reset();
    openModal('modal-cliente');
}

async function abrirModalEditarCliente(id) {
    try {
        const cliente = await getClienteById(id);
        editingClienteId = id;
        document.getElementById('modal-cliente-title').innerText = 'Editar Cliente';
        document.getElementById('cliente-dni').value = cliente.dni || '';
        document.getElementById('cliente-nombre').value = cliente.nombre || '';
        document.getElementById('cliente-telefono').value = cliente.telefono || '';
        openModal('modal-cliente');
    } catch (error) {
        console.error('Error cargando cliente:', error);
        mostrarNotificacion('Error', 'Error al cargar el cliente');
    }
}

// Guardar cliente
async function guardarCliente(event) {
    event.preventDefault();
    
    const dni = document.getElementById('cliente-dni').value;
    const nombre = document.getElementById('cliente-nombre').value;
    const telefono = document.getElementById('cliente-telefono').value;

    const cliente = { dni, nombre, telefono };

    try {
        if (editingClienteId) {
            await updateCliente(editingClienteId, cliente);
            mostrarNotificacion('Éxito', 'Cliente actualizado correctamente');
            editingClienteId = null;
        } else {
            await createCliente(cliente);
            mostrarNotificacion('Éxito', 'Cliente creado correctamente');
        }
        
        closeModal('modal-cliente');
        cargarClientes();
    } catch (error) {
        console.error('Error guardando cliente:', error);
        mostrarNotificacion('Error', 'Error al guardar el cliente: ' + error.message);
    }
}

// Eliminar cliente
function eliminarCliente(id) {
    mostrarConfirmacion(
        'Eliminar Cliente',
        '¿Estás seguro de que deseas eliminar este cliente?',
        async () => {
            try {
                await deleteCliente(id);
                mostrarNotificacion('Éxito', 'Cliente eliminado correctamente');
                cargarClientes();
            } catch (error) {
                console.error('Error eliminando cliente:', error);
                mostrarNotificacion('Error', 'Error al eliminar el cliente: ' + error.message);
            }
        }
    );
}

// Modales de mascota
function abrirModalNuevaMascota(clienteId) {
    editingMascotaId = null;
    document.getElementById('mascota-cliente-id').value = clienteId;
    document.getElementById('form-mascota').reset();
    openModal('modal-mascota');
}

async function abrirModalEditarMascota(id) {
    try {
        const mascota = await getMascotaById(id);
        editingMascotaId = id;
        document.getElementById('mascota-nombre').value = mascota.nombre || '';
        document.getElementById('mascota-raza').value = mascota.raza || '';
        document.getElementById('mascota-edad').value = mascota.edad || '';
        document.getElementById('mascota-cliente-id').value = mascota.cliente.id;
        openModal('modal-mascota');
    } catch (error) {
        console.error('Error cargando mascota:', error);
        mostrarNotificacion('Error', 'Error al cargar la mascota');
    }
}

// Guardar mascota
async function guardarMascota(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('mascota-nombre').value;
    const raza = document.getElementById('mascota-raza').value;
    const edad = document.getElementById('mascota-edad').value;
    const clienteId = document.getElementById('mascota-cliente-id').value;

    const mascota = {
        nombre,
        raza: raza || null,
        edad: edad ? parseInt(edad) : null,
        clienteId: parseInt(clienteId)
    };

    try {
        if (editingMascotaId) {
            await updateMascota(editingMascotaId, mascota);
            mostrarNotificacion('Éxito', 'Mascota actualizada correctamente');
            editingMascotaId = null;
        } else {
            await createMascota(mascota);
            mostrarNotificacion('Éxito', 'Mascota creada correctamente');
        }
        
        closeModal('modal-mascota');
        cargarClientes();
    } catch (error) {
        console.error('Error guardando mascota:', error);
        mostrarNotificacion('Error', 'Error al guardar la mascota: ' + error.message);
    }
}

// Eliminar mascota
function eliminarMascota(id) {
    mostrarConfirmacion(
        'Eliminar Mascota',
        '¿Estás seguro de que deseas eliminar esta mascota?',
        async () => {
            try {
                await deleteMascota(id);
                mostrarNotificacion('Éxito', 'Mascota eliminada correctamente');
                cargarClientes();
            } catch (error) {
                console.error('Error eliminando mascota:', error);
                mostrarNotificacion('Error', 'Error al eliminar la mascota: ' + error.message);
            }
        }
    );
}

// Estilos CSS para componentes
if (!document.querySelector('style[data-clientes-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-clientes-styles', 'true');
    style.innerText = `
        .clientes-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
        }

        @media (max-width: 768px) {
            .clientes-container {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}
