/* ==================== FUNCIONES DE CONSULTAS ==================== */

let currentConsultaId = null;

// Cargar y mostrar consultas
async function cargarConsultas() {
    try {
        const consultas = await getConsultas();
        const container = document.getElementById('consultas-container');
        container.innerHTML = construirTablaConsultas(consultas);
    } catch (error) {
        console.error('Error cargando consultas:', error);
        const container = document.getElementById('consultas-container');
        container.innerHTML = `
            <div class="empty-state">
                <h3>Error cargando citas</h3>
                <p>${error.message}</p>
            </div>
        `;
        mostrarNotificacion('Error', 'Error al cargar las citas: ' + error.message);
    }
}

// Abrir modal para nueva consulta
function abrirModalConsultaMultipaso() {
    currentConsultaId = null;
    document.getElementById('modal-consulta-title').innerText = 'Nueva Cita Médica';
    document.getElementById('submit-consulta-btn').innerText = 'Guardar Cita';
    
    mostrarPasoConsulta(1);
    cargarClientesEnSelect();
    openModal('modal-consulta');
}

// Cargar clientes en el select del paso 1
async function cargarClientesEnSelect() {
    try {
        const clientes = await getClientes();
        const select = document.getElementById('consulta-cliente-select');
        
        select.innerHTML = '<option value="">-- Selecciona un cliente --</option>';
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando clientes:', error);
        mostrarNotificacion('Error', 'Error al cargar los clientes');
    }
}

// Pasar del paso 1 al paso 2
async function irAlPaso2Consulta() {
    const clienteSelect = document.getElementById('consulta-cliente-select');
    const clienteId = clienteSelect.value;

    if (!clienteId) {
        mostrarNotificacion('Validación', 'Por favor selecciona un cliente');
        return;
    }

    app.selectedClientId = clienteId;

    try {
        const mascotas = await getMascotasCliente(clienteId);
        const mascotaSelect = document.getElementById('consulta-mascota-select');
        
        mascotaSelect.innerHTML = '<option value="">-- Selecciona una mascota --</option>';
        
        if (mascotas && mascotas.length > 0) {
            mascotas.forEach(mascota => {
                const option = document.createElement('option');
                option.value = mascota.id;
                option.textContent = mascota.nombre;
                mascotaSelect.appendChild(option);
            });
        } else {
            mascotaSelect.innerHTML = '<option value="">Este cliente no tiene mascotas registradas</option>';
        }

        mostrarPasoConsulta(2);
    } catch (error) {
        console.error('Error cargando mascotas:', error);
        mostrarNotificacion('Error', 'Error al cargar las mascotas del cliente');
    }
}

// Pasar del paso 2 al paso 3
function irAlPaso3Consulta() {
    const mascotaSelect = document.getElementById('consulta-mascota-select');
    const mascotaId = mascotaSelect.value;

    if (!mascotaId) {
        mostrarNotificacion('Validación', 'Por favor selecciona una mascota');
        return;
    }

    document.getElementById('consulta-mascota-id').value = mascotaId;
    mostrarPasoConsulta(3);
}

// Regresar del paso 2 al paso 1
function regresarAlPaso1Consulta() {
    document.getElementById('consulta-cliente-select').value = '';
    mostrarPasoConsulta(1);
}

// Regresar del paso 3 al paso 2
function regresarAlPaso2Consulta() {
    mostrarPasoConsulta(2);
}

// Mostrar/ocultar pasos del modal
function mostrarPasoConsulta(paso) {
    document.getElementById('consulta-step1').classList.remove('active');
    document.getElementById('consulta-step2').classList.remove('active');
    document.getElementById('consulta-step3').classList.remove('active');
    
    document.getElementById(`consulta-step${paso}`).classList.add('active');
}

// Guardar/Actualizar consulta
async function guardarConsulta(event) {
    event.preventDefault();

    const mascotaId = document.getElementById('consulta-mascota-id').value;
    const fecha = document.getElementById('consulta-fecha').value;
    const motivo = document.getElementById('consulta-motivo').value;
    const peso = document.getElementById('consulta-peso').value;
    const temperatura = document.getElementById('consulta-temperatura').value;
    const sintomas = document.getElementById('consulta-sintomas').value;
    const diagnostico = document.getElementById('consulta-diagnostico').value;
    const receta = document.getElementById('consulta-receta').value;
    const estado = document.getElementById('consulta-estado').value;

    if (!mascotaId || !fecha || !motivo) {
        mostrarNotificacion('Validación', 'Por favor completa los campos requeridos');
        return;
    }

    const consulta = {
        mascotaId: parseInt(mascotaId),
        fecha: new Date(fecha).toISOString(),
        motivo,
        peso: peso ? parseFloat(peso) : null,
        temperatura: temperatura ? parseFloat(temperatura) : null,
        sintomas: sintomas || null,
        diagnostico: diagnostico || null,
        receta: receta || null,
        estado
    };

    try {
        if (currentConsultaId) {
            await updateConsulta(currentConsultaId, consulta);
            mostrarNotificacion('Éxito', 'Cita actualizada correctamente');
        } else {
            await createConsulta(consulta);
            mostrarNotificacion('Éxito', 'Cita creada correctamente');
        }
        
        closeModal('modal-consulta');
        cargarConsultas();
    } catch (error) {
        console.error('Error guardando consulta:', error);
        mostrarNotificacion('Error', 'Error al guardar la cita: ' + error.message);
    }
}

// Abrir modal para editar consulta
async function abrirModalEditarConsulta(id) {
    try {
        const consulta = await getConsultaById(id);
        
        currentConsultaId = id;
        document.getElementById('modal-consulta-title').innerText = 'Editar Cita Médica';
        document.getElementById('submit-consulta-btn').innerText = 'Actualizar Cita';
        
        // Rellenar el formulario (paso 3 directamente)
        document.getElementById('consulta-mascota-id').value = consulta.mascota.id;
        document.getElementById('consulta-fecha').value = consulta.fecha.slice(0, 16);
        document.getElementById('consulta-motivo').value = consulta.motivo || '';
        document.getElementById('consulta-peso').value = consulta.peso || '';
        document.getElementById('consulta-temperatura').value = consulta.temperatura || '';
        document.getElementById('consulta-sintomas').value = consulta.sintomas || '';
        document.getElementById('consulta-diagnostico').value = consulta.diagnostico || '';
        document.getElementById('consulta-receta').value = consulta.receta || '';
        document.getElementById('consulta-estado').value = consulta.estado || 'Pendiente';
        
        mostrarPasoConsulta(3);
        openModal('modal-consulta');
    } catch (error) {
        console.error('Error cargando consulta:', error);
        mostrarNotificacion('Error', 'Error al cargar la cita');
    }
}

// Eliminar consulta
function eliminarConsulta(id) {
    mostrarConfirmacion(
        'Eliminar Cita',
        '¿Estás seguro de que deseas eliminar esta cita?',
        async () => {
            try {
                await deleteConsulta(id);
                mostrarNotificacion('Éxito', 'Cita eliminada correctamente');
                cargarConsultas();
            } catch (error) {
                console.error('Error eliminando consulta:', error);
                mostrarNotificacion('Error', 'Error al eliminar la cita: ' + error.message);
            }
        }
    );
}

// Event listener del formulario
window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-consulta');
    if (form) {
        form.addEventListener('submit', guardarConsulta);
    }
});
