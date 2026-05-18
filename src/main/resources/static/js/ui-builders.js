/* ==================== CONSTRUCTORES DE UI ==================== */

function construirClienteCard(cliente) {
    return `
        <div class="client-card">
            <div class="client-header">
                <h3>${cliente.nombre || 'Sin nombre'}</h3>
                <div class="client-actions">
                    <button class="btn-icon" onclick="abrirModalEditarCliente(${cliente.id})" title="Editar">✏️</button>
                    <button class="btn-icon" onclick="eliminarCliente(${cliente.id})" title="Eliminar">🗑️</button>
                </div>
            </div>
            <div class="client-info">
                <p><strong>DNI/Cédula:</strong> ${cliente.dni || 'N/A'}</p>
                <p><strong>Teléfono:</strong> ${cliente.telefono || 'N/A'}</p>
            </div>
            <div class="client-pets">
                <div class="pets-header">
                    <h4>Mascotas (${cliente.mascotas ? cliente.mascotas.length : 0})</h4>
                    <button class="btn-small" onclick="abrirModalNuevaMascota(${cliente.id})">+ Mascota</button>
                </div>
                <div class="pets-list">
                    ${construirListaMascotas(cliente.mascotas)}
                </div>
            </div>
        </div>
    `;
}

function construirListaMascotas(mascotas) {
    if (!mascotas || mascotas.length === 0) {
        return '<p class="text-light">No hay mascotas registradas</p>';
    }

    return mascotas.map(mascota => `
        <div class="pet-item">
            <div class="pet-info">
                <strong>${mascota.nombre || 'Sin nombre'}</strong>
                <small>${mascota.raza || 'Raza desconocida'} • ${mascota.edad || '?'} años</small>
            </div>
            <div class="pet-actions">
                <button class="btn-icon-small" onclick="abrirModalEditarMascota(${mascota.id})" title="Editar">✏️</button>
                <button class="btn-icon-small" onclick="eliminarMascota(${mascota.id})" title="Eliminar">🗑️</button>
            </div>
        </div>
    `).join('');
}

function construirTablaConsultas(consultas) {
    if (!consultas || consultas.length === 0) {
        return `
            <div class="empty-state">
                <h3>Sin citas registradas</h3>
                <p>Crea una nueva cita para comenzar</p>
            </div>
        `;
    }

    const filas = consultas.map(consulta => {
        const mascota = consulta.mascota;
        const cliente = mascota ? mascota.cliente : null;
        
        return `
            <tr>
                <td>${cliente ? cliente.nombre : 'N/A'}</td>
                <td>${mascota ? mascota.nombre : 'N/A'}</td>
                <td>${new Date(consulta.fecha).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</td>
                <td>${consulta.motivo || 'N/A'}</td>
                <td><span class="estado-${consulta.estado.toLowerCase()}">${consulta.estado}</span></td>
                <td>
                    <button class="btn-icon" onclick="abrirModalEditarConsulta(${consulta.id})" title="Editar">✏️</button>
                    <button class="btn-icon" onclick="eliminarConsulta(${consulta.id})" title="Eliminar">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <table class="consultas-table">
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Mascota</th>
                    <th>Fecha y Hora</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    `;
}

// Clases CSS para estados
const estadoClasses = `
    <style data-estado-styles>
        .estado-pendiente {
            background-color: #fff3cd;
            color: #856404;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .estado-atendido {
            background-color: #d4edda;
            color: #155724;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .estado-cancelado {
            background-color: #f8d7da;
            color: #721c24;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
        }

        .text-light {
            color: #999;
            font-style: italic;
        }
    </style>
`;

if (!document.querySelector('style[data-estado-styles]')) {
    document.head.insertAdjacentHTML('beforeend', estadoClasses);
}
