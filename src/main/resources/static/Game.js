window.buses = {}; // Objeto para almacenar los buses

document.addEventListener("DOMContentLoaded", () => {
    console.log("Verificando conexión WebSocket...");
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Error: No se encontró el canvas 'gameCanvas'.");
        return;
    }
    window.canvas = canvas; // Hacer `canvas` accesible globalmente
    window.ctx = canvas.getContext("2d"); // Hacer `ctx` accesible globalmente

    console.log("Canvas inicializado");

    createMap();

    // Verificar si la conexión WebSocket está guardada en sessionStorage
    if (sessionStorage.getItem("wsConnected") !== "true") {
        console.error("No hay conexión WebSocket guardada.");
        alert("No estás conectado al WebSocket. Regresando a la página principal.");
        window.location.href = "index.html";
        return;
    }

    console.log("Conexión WebSocket detectada en sessionStorage. Intentando reconectar...");
    reconnectWebSocket();
});

function reconnectWebSocket() {
    const socket = new SockJS("http://localhost:8080/ws");
    window.client = new StompJs.Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        onConnect: () => {
            console.log("Reconectado al servidor WebSocket en game.js");

            // Recuperar playerId desde localStorage
            window.playerId = localStorage.getItem("playerId");
            if (!window.playerId) {
                console.error("No se encontró playerId en localStorage.");
                alert("No se encontró un ID de jugador. Volviendo al menú.");
                window.location.href = "index.html";
                return;
            }

            suscribirEventos(); // Suscribirse al WebSocket
        },
        onStompError: (frame) => {
            console.error("Error en WebSocket:", frame);
        }
    });
    window.client.activate();
}

function suscribirEventos() {
    const playerId = window.playerId; // Usar playerId correctamente
    if (!playerId) {
        console.error("Error: playerId no definido.");
        return;
    }

    window.client.subscribe("/topic/game", (message) => {
        console.log("Mensaje recibido del servidor:", message.body);

        const lines = message.body.split("\n");
        lines.forEach(line => {
            const data = line.split(":");

            if (data[0] === "NEW_BUS") {
                const [id, x, y, plate] = data[1].split(",");
                buses[id] = { x: parseInt(x), y: parseInt(y), width: 50, height: 30, angle: 0, plate: plate };
            } else if (data[0] === "ALL_BUSES") {
                buses = {}; // Reiniciar solo la lista global de buses
                for (let i = 1; i < data.length; i++) {
                    const [id, x, y, angle, plate] = data[i].split(",");
                    buses[id] = { x: parseInt(x), y: parseInt(y), width: 50, height: 30, angle: parseFloat(angle), plate: plate };
                }
            } else if (data[0] === "BUS") {
                const [id, x, y, angle, plate] = data[1].split(",");
                if (buses[id]) {
                    buses[id].x = parseInt(x);
                    buses[id].y = parseInt(y);
                    buses[id].angle = parseFloat(angle); // Actualizar la orientación
                    buses[id].plate = plate; // Actualizar la placa
                }
            }
        });

        drawBuses();
    });

    // Enviar solicitud para unirse al juego
    console.log("Enviando solicitud de conexión para", playerId);
    window.client.publish({ destination: "/app/join", body: playerId });

    // Capturar teclas y cambiar dirección
    document.addEventListener("keydown", (event) => {
        let direction = null;
        switch (event.key) {
            case "ArrowUp": direction = "UP"; break;
            case "ArrowDown": direction = "DOWN"; break;
            case "ArrowLeft": direction = "LEFT"; break;
            case "ArrowRight": direction = "RIGHT"; break;
        }
        if (direction && window.client.connected) {
            console.log("Enviando movimiento:", direction);
            window.client.publish({ destination: "/app/move", body: playerId + ":" + direction });
        }
    });
}