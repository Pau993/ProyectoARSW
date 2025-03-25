document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectBtn");
    let client = null;
    let playerId = "player_" + Math.floor(Math.random() * 10000);

    connectBtn.addEventListener("click", () => {
        const socket = new SockJS("http://localhost:8080/ws");
        client = new StompJs.Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Conectado al servidor WebSocket");

                // Escuchar cambios en todos los buses
                client.subscribe("/topic/game", (message) => {
                    const lines = message.body.split("\n");
                    lines.forEach(line => {
                        const data = line.split(":");

                        if (data[0] === "NEW_BUS") {
                            const [id, x, y] = data[1].split(",");
                            buses[id] = { x: parseInt(x), y: parseInt(y), width: 50, height: 30 };
                        } else if (data[0] === "ALL_BUSES") {
                            buses = {};
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

                client.publish({ destination: "/app/join", body: playerId });
            },
        });

        client.activate();
    });

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
