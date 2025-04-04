window.buses = {}; // Objeto global para almacenar los buses
window.passengers = {}; // Objeto global para pasajeros


document.addEventListener("DOMContentLoaded", () => {
    console.log("Verificando conexión WebSocket...");
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Error: No se encontró el canvas 'gameCanvas'.");
        return;
    }
    window.canvas = canvas; 
    window.ctx = canvas.getContext("2d");

    console.log("Canvas inicializado");

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

            window.playerId = localStorage.getItem("playerId");
            if (!window.playerId) {
                console.error("No se encontró playerId en localStorage.");
                alert("No se encontró un ID de jugador. Volviendo al menú.");
                window.location.href = "index.html";
                return;
            }

            suscribirEventos();
        },
        onStompError: (frame) => {
            console.error("Error en WebSocket:", frame);
        }
    });
    window.client.activate();
}

function suscribirEventos() {
    const playerId = window.playerId || localStorage.getItem("playerId");

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
                if (plate && plate !== "") {
                    window.buses[id] = { x: parseInt(x), y: parseInt(y), width: 50, height: 30, angle: 0, plate: plate };
                    console.log(`Nuevo bus registrado: ID=${id}, X=${x}, Y=${y}, Placa=${plate}`);
                }
            } else if (data[0] === "ALL_BUSES") {
                window.buses = {}; 
                for (let i = 1; i < data.length; i++) {
                    const [id, plate, x, y, direction] = data[i].split(",");
                    if (plate && plate !== "") {
                        window.buses[id] = { x: parseInt(x), y: parseInt(y), width: 50, height: 30, angle: direction === "LEFT" || direction === "RIGHT" ? 0 : 90, plate: plate };
                    }
                }
            } else if (data[0] === "BUS") {
                const [id, x, y, angle, plate] = data[1].split(",");
                if (window.buses[id]) {
                    window.buses[id].x = parseInt(x);
                    window.buses[id].y = parseInt(y);
                    window.buses[id].angle = parseFloat(angle);
                    window.buses[id].plate = plate;
                }
            } else if (data[0] === "COLLISION") {
                const [bus1, bus2] = data[1].split(",");
                delete window.buses[bus1];
                delete window.buses[bus2];
                console.log(`Buses colisionados: ${bus1}, ${bus2}`);
            } else if (message.body.startsWith("PASSENGERS")) {
                const passengersData = JSON.parse(message.body.substring(10));
                console.log("Mensaje recibido del servidor - PASAJEROS:", passengersData);
            
                if (Array.isArray(passengersData) && passengersData.length > 0) {
                    console.log(`✅ ${passengersData.length} pasajeros recibidos.`);
                    generatePeople(passengersData); // ✅ Aquí va el render
                } else {
                    console.warn("⚠️ No se recibieron pasajeros o la lista está vacía.");
                }
            }
            
        });

        drawBuses();
        updateBuses();
    });

    console.log("Enviando solicitud de conexión para", playerId);
    window.client.publish({ destination: "/app/join", body: playerId });

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

function requestPassengers() {
    if (window.client.connected) {
        window.client.publish({
            destination: "/app/generatePassenger",
            body: ""
        });
    }
}

setTimeout(requestPassengers, 1000);
