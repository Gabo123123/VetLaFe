/* ==================== APLICACIÓN PRINCIPAL ==================== */

// Evento de carga al iniciar
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verificar autenticación
        const user = await getCurrentUser();
        app.currentUserId = user.id;
        app.currentUsername = user.username;
        
        // Cargar datos iniciales
        cargarClientes();
        cargarConsultas();
        actualizarDatosUsuario();
        
        // Configurar listeners
        configurarListeners();
    } catch (error) {
        console.error('Error al iniciar:', error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            window.location.href = '/login.html';
        }
    }
});

// Configurar event listeners
function configurarListeners() {
    // Botones del sidebar
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            cambiarSeccion(section);
            
            // Actualizar estado activo
            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Botones de crear
    const btnNewClient = document.getElementById('btn-new-client');
    if (btnNewClient) {
        btnNewClient.addEventListener('click', abrirModalNuevoCliente);
    }

    const btnNewConsulta = document.getElementById('btn-new-consulta');
    if (btnNewConsulta) {
        btnNewConsulta.addEventListener('click', abrirModalConsultaMultipaso);
    }

    // Formulario de cliente
    const formCliente = document.getElementById('form-cliente');
    if (formCliente) {
        formCliente.addEventListener('submit', guardarCliente);
    }

    // Formulario de mascota
    const formMascota = document.getElementById('form-mascota');
    if (formMascota) {
        formMascota.addEventListener('submit', guardarMascota);
    }
}

// Cambiar sección de contenido
function cambiarSeccion(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // Mostrar sección seleccionada
    const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
        sectionElement.classList.add('active');
        
        // Actualizar título
        const titles = {
            clientes: 'Clientes y Mascotas',
            consultas: 'Citas y Fichas Médicas',
            estadisticas: 'Estadísticas y Sesión'
        };
        document.getElementById('page-title').innerText = titles[section] || 'Dashboard';
        
        // Actualizar botón de encabezado
        const headerActions = document.querySelector('.header-actions');
        if (section === 'clientes') {
            document.getElementById('btn-new-client').style.display = 'block';
            document.getElementById('btn-new-consulta').style.display = 'none';
        } else if (section === 'consultas') {
            document.getElementById('btn-new-client').style.display = 'none';
            document.getElementById('btn-new-consulta').style.display = 'block';
        } else if (section === 'estadisticas') {
            document.getElementById('btn-new-client').style.display = 'none';
            document.getElementById('btn-new-consulta').style.display = 'none';
        }
    }
}

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
    document.getElementById('modal-cliente-title').innerText = 'Nuevo Cliente';
    document.getElementById('form-cliente').reset();
    openModal('modal-cliente');
}

async function abrirModalEditarCliente(id) {
    try {
        const cliente = await getClienteById(id);
        document.getElementById('modal-cliente-title').innerText = 'Editar Cliente';
        document.getElementById('cliente-dni').value = cliente.dni || '';
        document.getElementById('cliente-nombre').value = cliente.nombre || '';
        document.getElementById('cliente-telefono').value = cliente.telefono || '';
        
        // Guardar ID para update
        document.getElementById('form-cliente').dataset.clienteId = id;
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
    const clienteId = event.target.dataset.clienteId;

    const cliente = { dni, nombre, telefono };

    try {
        if (clienteId) {
            await updateCliente(clienteId, cliente);
            mostrarNotificacion('Éxito', 'Cliente actualizado correctamente');
            delete event.target.dataset.clienteId;
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
    document.getElementById('mascota-cliente-id').value = clienteId;
    document.getElementById('form-mascota').reset();
    openModal('modal-mascota');
}

async function abrirModalEditarMascota(id) {
    try {
        const mascota = await getMascotaById(id);
        document.getElementById('mascota-nombre').value = mascota.nombre || '';
        document.getElementById('mascota-raza').value = mascota.raza || '';
        document.getElementById('mascota-edad').value = mascota.edad || '';
        document.getElementById('mascota-cliente-id').value = mascota.cliente.id;
        
        // Guardar ID para update
        document.getElementById('form-mascota').dataset.mascotaId = id;
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
    const mascotaId = event.target.dataset.mascotaId;

    const mascota = {
        nombre,
        raza: raza || null,
        edad: edad ? parseInt(edad) : null,
        clienteId: parseInt(clienteId)
    };

    try {
        if (mascotaId) {
            await updateMascota(mascotaId, mascota);
            mostrarNotificacion('Éxito', 'Mascota actualizada correctamente');
            delete event.target.dataset.mascotaId;
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

// Actualizar datos del usuario
function actualizarDatosUsuario() {
    const usernameElement = document.getElementById('current-username');
    if (usernameElement) {
        usernameElement.textContent = app.currentUsername || 'Usuario';
    }
}

// Estilos CSS para componentes (inyectados si no existen)
if (!document.querySelector('style[data-app-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-app-styles', 'true');
    style.innerText = `
        .clientes-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
        }

        .client-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .client-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .client-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }

        .client-header h3 {
            margin: 0;
            color: #667eea;
        }

        .client-actions {
            display: flex;
            gap: 8px;
        }

        .btn-icon {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn-icon:hover {
            transform: scale(1.2);
        }

        .client-info p {
            margin: 5px 0;
            font-size: 14px;
        }

        .pets-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0 10px 0;
        }

        .pets-header h4 {
            margin: 0;
            font-size: 14px;
            color: #666;
        }

        .btn-small {
            padding: 4px 8px;
            font-size: 12px;
            background-color: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .btn-small:hover {
            background-color: #764ba2;
        }

        .pet-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            margin-bottom: 8px;
            font-size: 13px;
        }

        .pet-info strong {
            display: block;
            color: #333;
        }

        .pet-info small {
            color: #999;
        }

        .pet-actions {
            display: flex;
            gap: 6px;
        }

        .btn-icon-small {
            background: none;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn-icon-small:hover {
            transform: scale(1.15);
        }

        .consulta-step {
            display: none;
        }

        .consulta-step.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .statistics-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }

        .stat-card, .logout-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stat-card h3, .logout-card h3 {
            color: #667eea;
            margin-bottom: 15px;
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }

        .stat-item strong {
            color: #333;
        }

        .logout-btn {
            background-color: #e74c3c;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin-top: 15px;
            font-weight: 600;
            transition: background-color 0.3s;
        }

        .logout-btn:hover {
            background-color: #c0392b;
        }

        @media (max-width: 768px) {
            .clientes-container {
                grid-template-columns: 1fr;
            }

            .statistics-content {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}
