document.addEventListener("DOMContentLoaded", () => {
    let client = null;
    let playerId = localStorage.getItem("username") || "player_" + Math.floor(Math.random() * 10000);

    function connectWebSocket() {
        if (client && client.connected) {
            console.log("✅ WebSocket ya está conectado.");
            return;
        }

        const socket = new SockJS("http://localhost:8080/ws");
        client = new StompJs.Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Conectado al servidor WebSocket");

                // Suscribirse para recibir actualizaciones de los buses
                client.subscribe("/topic/game", (message) => {
                    const lines = message.body.split("\n");
                    lines.forEach(line => {
                        const data = line.split(":");

                        if (data[0] === "NEW_BUS") {
                            const [id, x, y] = data[1].split(",");
                            buses[id] = { x: parseInt(x), y: parseInt(y), width: 50, height: 30 };
                        } else if (data[0] === "ALL_BUSES") {
                            buses = {}; // Reiniciar la lista
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

                // Enviar la solicitud para unirse al juego
                client.publish({ destination: "/app/join", body: playerId });
            },
        });

        client.activate();
    }

    connectWebSocket();

    // 🎮 Detectar teclas y cambiar dirección
    document.addEventListener("keydown", (event) => {
        let direction = null;
        switch (event.key) {
            case "ArrowUp": direction = "UP"; break;
            case "ArrowDown": direction = "DOWN"; break;
            case "ArrowLeft": direction = "LEFT"; break;
            case "ArrowRight": direction = "RIGHT"; break;
        }
        if (direction && client && client.connected) {
            client.publish({ destination: "/app/move", body: playerId + ":" + direction });
        }
    });
});
