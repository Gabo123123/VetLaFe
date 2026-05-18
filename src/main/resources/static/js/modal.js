/* ==================== FUNCIONES DE MODAL ==================== */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // Limpiar formulario si existe
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        // Limpiar inputs ocultos
        const hiddenInputs = modal.querySelectorAll('input[type="hidden"]');
        hiddenInputs.forEach(input => input.value = '');
    }
}

function mostrarNotificacion(titulo, mensaje) {
    document.getElementById('notification-title').innerText = titulo;
    document.getElementById('notification-message').innerText = mensaje;
    openModal('modal-notification');
}

function mostrarConfirmacion(titulo, mensaje, callback) {
    app.pendingConfirmation = callback;
    document.getElementById('confirmation-title').innerText = titulo;
    document.getElementById('confirmation-message').innerText = mensaje;
    openModal('modal-confirmation');
}

function confirmAction() {
    if (app.pendingConfirmation) {
        app.pendingConfirmation();
        app.pendingConfirmation = null;
    }
    closeConfirmation();
}

function closeConfirmation() {
    closeModal('modal-confirmation');
    app.pendingConfirmation = null;
}

function closeNotification() {
    closeModal('modal-notification');
}

// Cerrar modales al hacer clic fuera
window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Estilos CSS para modales (inyectados si no existen)
if (!document.querySelector('style[data-modal-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-modal-styles', 'true');
    style.innerText = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background-color: white;
            padding: 0;
            border-radius: 10px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #ddd;
        }

        .modal-header h3 {
            margin: 0;
            color: #667eea;
            font-size: 18px;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #999;
            transition: color 0.3s;
        }

        .close-btn:hover {
            color: #333;
        }

        .modal form {
            padding: 20px;
        }
    `;
    document.head.appendChild(style);
}
