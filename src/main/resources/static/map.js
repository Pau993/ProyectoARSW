document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");

    if (!canvas) {
        console.error("❌ Error: No se encontró el canvas 'gameCanvas'.");
        return;
    }

    window.ctx = canvas.getContext("2d");
    window.canvas = canvas;

    // Función para ajustar el tamaño del canvas y redibujar el mapa
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawMap();
        drawBus();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Inicializar el bus
    window.bus = { x: 110, y: 110, width: 30, height: 20 };

    // Mover el bus con las teclas de flecha
    document.addEventListener('keydown', moveBus);
});

function drawMap() {
    const width = window.canvas.width;
    const height = window.canvas.height;
    const roadSize = 40; // Aumenta el tamaño de las carreteras

    // Carreteras horizontales
    for (let y = 100; y < height; y += 200) {
        drawRoad(0, y, width, roadSize);
    }

    // Carreteras verticales
    for (let x = 100; x < width; x += 200) {
        drawRoad(x, 0, roadSize, height);
    }
}

function drawRoad(x, y, width, height) {
    window.ctx.fillStyle = '#808080'; // Color de la carretera
    window.ctx.fillRect(x, y, width, height);

    // Líneas blancas
    window.ctx.strokeStyle = '#FFFFFF';
    window.ctx.lineWidth = 2;
    window.ctx.setLineDash([20, 15]); // Líneas discontinuas

    if (width > height) {
        // Línea horizontal
        window.ctx.beginPath();
        window.ctx.moveTo(x, y + height / 2);
        window.ctx.lineTo(x + width, y + height / 2);
        window.ctx.stroke();
    } else {
        // Línea vertical
        window.ctx.beginPath();
        window.ctx.moveTo(x + width / 2, y);
        window.ctx.lineTo(x + width / 2, y + height);
        window.ctx.stroke();
    }
}

function drawBus() {
    window.ctx.fillStyle = 'yellow';
    window.ctx.fillRect(window.bus.x, window.bus.y, window.bus.width, window.bus.height);
}

function isOnRoad(x, y) {
    const roadSize = 40; // Tamaño de las carreteras
    // Verificar si el bus está en una carretera horizontal o vertical
    const onHorizontalRoad = (y % 200 >= 100 && y % 200 <= 100 + roadSize);
    const onVerticalRoad = (x % 200 >= 100 && x % 200 <= 100 + roadSize);

    return onHorizontalRoad || onVerticalRoad;
}

function moveBus(event) {
    const step = 10;
    let newX = window.bus.x;
    let newY = window.bus.y;

    switch (event.key) {
        case 'ArrowUp':
            newY -= step;
            break;
        case 'ArrowDown':
            newY += step;
            break;
        case 'ArrowLeft':
            newX -= step;
            break;
        case 'ArrowRight':
            newX += step;
            break;
    }

    // Verificar si la nueva posición está en la carretera
    if (isOnRoad(newX, newY)) {
        window.bus.x = newX;
        window.bus.y = newY;
        window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
        drawMap();
        drawBus();
    }
}