document.addEventListener("DOMContentLoaded", () => {
    console.log("🔍 Verificando conexión WebSocket...");

    // Verificar si la conexión WebSocket está guardada en sessionStorage
    if (sessionStorage.getItem("wsConnected") !== "true") {
        console.error("❌ No hay conexión WebSocket guardada.");
        alert("❌ No estás conectado al WebSocket. Regresando a la página principal.");
        window.location.href = "index.html";
        return;
    }

    console.log("✅ Conexión WebSocket detectada en sessionStorage. Intentando reconectar...");
    reconnectWebSocket();
});

function reconnectWebSocket() {
    const socket = new SockJS("http://localhost:8080/ws");
    window.client = new StompJs.Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        reconnectDelay: 5000, // Intentar reconectar cada 5 segundos
        onConnect: () => {
            console.log("✅ Reconectado al servidor WebSocket en game.js");
            sessionStorage.setItem("wsConnected", "true"); // Guardar estado de conexión
            suscribirEventos();
        },
        onStompError: (frame) => {
            console.error("❌ Error en WebSocket:", frame);
        }
    });
    window.client.activate();
}

function suscribirEventos() {
    window.client.subscribe("/topic/game", (message) => {
        console.log("📩 Mensaje recibido del servidor:", message.body);
        
        const lines = message.body.split("\n");
        lines.forEach(line => {
            const data = line.split(":");

            if (data[0] === "NEW_BUS") {
                const [id, x, y] = data[1].split(",");
                buses[id] = { x: parseInt(x), y: parseInt(y), width: 50, height: 30 };
            } else if (data[0] === "ALL_BUSES") {
                buses = {}; // Reiniciar lista de buses
                for (let i = 1; i < data.length; i++) {
                    const [id, x, y] = data[i].split(",");
                    buses[id] = { x: parseInt(x), y: parseInt(y), width: 50, height: 30 };
                }
            } else if (data[0] === "BUS") {
                const [id, x, y] = data[1].split(",");
                if (buses[id]) {
                    buses[id].x = parseInt(x);
                    buses[id].y = parseInt(y);
                }
            }
        });

        drawBuses();
    });

    // Enviar solicitud para unirse al juego
    console.log("📤 Enviando solicitud de conexión para", playerId);
    window.client.publish({ destination: "/app/join", body: playerId });

    // 🎮 Capturar teclas y cambiar dirección
    document.addEventListener("keydown", (event) => {
        let direction = null;
        switch (event.key) {
            case "ArrowUp": direction = "UP"; break;
            case "ArrowDown": direction = "DOWN"; break;
            case "ArrowLeft": direction = "LEFT"; break;
            case "ArrowRight": direction = "RIGHT"; break;
        }
        if (direction && window.client.connected) {
            console.log("📤 Enviando movimiento:", direction);
            window.client.publish({ destination: "/app/move", body: playerId + ":" + direction });
        }
    });
}
