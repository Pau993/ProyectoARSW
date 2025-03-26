let client = null;

document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectBtn");

    if (connectBtn) {
        connectBtn.addEventListener("click", connectWebSocket);
    }

    // 🔹 Asegurar que los botones existen antes de asignar eventos
    const registerBtn = document.querySelector(".btn-container button:nth-child(2)");
    if (registerBtn) {
        registerBtn.addEventListener("click", showRegisterPlate);
    }

    const backBtn = document.querySelector(".btn-back");
    if (backBtn) {
        backBtn.addEventListener("click", goBack);
    }
});

function connectWebSocket() {
    if (window.client && window.client.connected) {
        alert("Ya estás conectado al WebSocket.");
        return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    window.client = new StompJs.Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        onConnect: () => {
            console.log("✅ Conectado al servidor WebSocket");
            alert("Conectado al WebSocket correctamente.");
        },
        onStompError: (frame) => {
            console.error("❌ Error en WebSocket:", frame);
        }
    });

    window.client.activate();
}

function showRegisterPlate() {
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('register-plate').style.display = 'flex';
}

function goBack() {
    document.getElementById('register-plate').style.display = 'none';
    document.getElementById('main-view').style.display = 'flex';
}

function generatePlate() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let plate = "";

    for (let i = 0; i < 3; i++) {
        plate += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    plate += "-";

    for (let i = 0; i < 3; i++) {
        plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return plate;
}

function registerUser() {
    const user = document.getElementById('user').value;
    if (!user) {
        alert("Por favor, ingresa tu nombre de usuario.");
        return;
    }

    const plate = generatePlate();
    document.getElementById('plate').value = plate;

    // Guardar usuario y placa en localStorage
    localStorage.setItem("username", user);
    localStorage.setItem("plate", plate);

    // Redirigir al juego
    window.location.href = "game.html";
}
