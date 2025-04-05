let client = null;

document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectBtn");

    if (connectBtn) {
        connectBtn.addEventListener("click", connectWebSocket);
    }

    const registerBtn = document.querySelector(".btn-container button:nth-child(2)");
    if (registerBtn) {
        registerBtn.addEventListener("click", showRegisterPlate);
    }

    const backBtn = document.querySelector(".btn-back");
    if (backBtn) {
        backBtn.addEventListener("click", goBack);
    }

    const registerUserBtn = document.getElementById("register-button");
    if (registerUserBtn) {
        registerUserBtn.addEventListener("click", registerUser);
    }

    const startGameBtn = document.getElementById("start-game-button");
    if (startGameBtn) {
        startGameBtn.addEventListener("click", startGame);
    }
});

function connectWebSocket() {
    if (window.client && window.client.connected) {
        alert("Ya estás conectado al WebSocket.");
        return;
    }

    const socket = new SockJS(window.location.origin + "/ws");
    window.client = new StompJs.Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        onConnect: () => {
            console.log("Conectado al servidor WebSocket");
            alert("Conectado al WebSocket correctamente.");
            
            // Guardar estado de conexión
            sessionStorage.setItem("wsConnected", "true");
        },
        onStompError: (frame) => {
            console.error(" Error en WebSocket:", frame);
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

    if (!window.client || !window.client.connected) {
        alert("No puedes jugar sin estar conectado al WebSocket.");
        return;
    }

    const plate = generatePlate();
    document.getElementById('plate').value = plate;

    // Guardar usuario y placa en localStorage
    localStorage.setItem("username", user);
    localStorage.setItem("playerId", plate);

    // Enviar la placa y el usuario al servidor
    const message = `${user}:${plate}`;
    window.client.publish({ destination: "/app/join", body: message });

    // Mostrar botón de iniciar juego
    document.getElementById("register-button").style.display = "none";
    document.getElementById("start-game-button").style.display = "block";


}

function startGame() {
    const plate = localStorage.getItem("playerId");
    if (!plate) {
        alert("No se encontró una placa registrada. Por favor, regístrate primero.");
        return;
    }

    // Redirigir al juego con la placa asignada
    window.location.href = `game.html?plate=${encodeURIComponent(plate)}`;
}