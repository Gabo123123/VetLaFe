/* ==================== FUNCIONES DE API ==================== */

async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login.html';
                return null;
            }
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en llamada API:', error);
        throw error;
    }
}

// Clientes API
async function getClientes() {
    return apiCall('/clientes');
}

async function getClienteById(id) {
    return apiCall(`/clientes/${id}`);
}

async function createCliente(cliente) {
    return apiCall('/clientes', {
        method: 'POST',
        body: JSON.stringify(cliente)
    });
}

async function updateCliente(id, cliente) {
    return apiCall(`/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cliente)
    });
}

async function deleteCliente(id) {
    return apiCall(`/clientes/${id}`, {
        method: 'DELETE'
    });
}

// Mascotas API
async function getMascotas() {
    return apiCall('/mascotas');
}

async function getMascotasCliente(clienteId) {
    return apiCall(`/mascotas/cliente/${clienteId}`);
}

async function getMascotaById(id) {
    return apiCall(`/mascotas/${id}`);
}

async function createMascota(mascota) {
    return apiCall('/mascotas', {
        method: 'POST',
        body: JSON.stringify(mascota)
    });
}

async function updateMascota(id, mascota) {
    return apiCall(`/mascotas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(mascota)
    });
}

async function deleteMascota(id) {
    return apiCall(`/mascotas/${id}`, {
        method: 'DELETE'
    });
}

// Consultas API
async function getConsultas() {
    return apiCall('/consultas');
}

async function getConsultaById(id) {
    return apiCall(`/consultas/${id}`);
}

async function createConsulta(consulta) {
    return apiCall('/consultas', {
        method: 'POST',
        body: JSON.stringify(consulta)
    });
}

async function updateConsulta(id, consulta) {
    return apiCall(`/consultas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(consulta)
    });
}

async function deleteConsulta(id) {
    return apiCall(`/consultas/${id}`, {
        method: 'DELETE'
    });
}

// User/Auth API
async function getCurrentUser() {
    return apiCall('/user');
}

async function logout() {
    try {
        await apiCall('/logout', { method: 'POST' });
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Error en logout:', error);
        window.location.href = '/login.html';
    }
}
