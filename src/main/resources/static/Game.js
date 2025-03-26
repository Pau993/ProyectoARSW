document.addEventListener("DOMContentLoaded", () => {
    if (!window.client || !window.client.connected) {
        alert("❌ Error: No estás conectado al WebSocket. Vuelve a la pantalla principal y conéctate.");
        window.location.href = "index.html";
        return;
    }

    let playerId = localStorage.getItem("username") || "player_" + Math.floor(Math.random() * 10000);

    // Escuchar mensajes del WebSocket
    window.client.subscribe("/topic/game", (message) => {
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

    // Enviar solicitud para unirse al juego
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
            window.client.publish({ destination: "/app/move", body: playerId + ":" + direction });
        }
    });
});
