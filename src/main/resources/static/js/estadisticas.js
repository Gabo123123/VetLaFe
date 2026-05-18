/* ==================== FUNCIONES DE ESTADÍSTICAS ==================== */

// Inicializar página
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verificar autenticación
        const user = await getCurrentUser();
        app.currentUserId = user.id;
        app.currentUsername = user.username;
        
        // Actualizar datos del usuario
        actualizarDatosUsuario();
        
        // Cargar estadísticas
        cargarEstadisticas();
    } catch (error) {
        console.error('Error al iniciar:', error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            window.location.href = '/login.html';
        }
    }
});

// Actualizar datos del usuario
function actualizarDatosUsuario() {
    const usernameElement = document.getElementById('current-username');
    if (usernameElement) {
        usernameElement.textContent = app.currentUsername || 'Usuario';
    }
}

// Cargar estadísticas
async function cargarEstadisticas() {
    try {
        const [clientes, mascotas, consultas] = await Promise.all([
            getClientes(),
            getMascotas(),
            getConsultas()
        ]);

        // Actualizar contadores
        document.getElementById('stat-clientes').innerText = clientes.length;
        document.getElementById('stat-mascotas').innerText = mascotas.length;
        document.getElementById('stat-consultas').innerText = consultas.length;
        
        // Contar citas pendientes
        const pendientes = consultas.filter(c => c.estado === 'Pendiente').length;
        document.getElementById('stat-pendientes').innerText = pendientes;

    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        mostrarNotificacion('Error', 'Error al cargar las estadísticas: ' + error.message);
    }
}

// Estilos CSS para estadísticas
if (!document.querySelector('style[data-stats-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-stats-styles', 'true');
    style.innerText = `
        .empty-state {
            text-align: center;
            padding: 50px 20px;
            color: #999;
        }

        .empty-state h3 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .empty-state p {
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
}
