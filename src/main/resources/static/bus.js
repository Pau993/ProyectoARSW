const mapWidth = 5 * 200;
const mapHeight = 5 * 200;

function generateRandomBusPosition() {
    const tileSize = 200;
    const roadWidth = 100;

    let x, y;

    do {
        x = Math.floor(Math.random() * (mapWidth - roadWidth));
        y = Math.floor(Math.random() * (mapHeight - roadWidth));
    } while (!isOnRoad(x, y));

    return { x, y };
}

function isOnRoad(x, y) {
    const tileSize = 200;
    const roadWidth = 100;

    const xIndex = Math.floor(x / tileSize);
    const yIndex = Math.floor(y / tileSize);

    const isHorizontalRoad = (y % tileSize) >= (tileSize - roadWidth) / 2 && (y % tileSize) <= (tileSize + roadWidth) / 2;
    const isVerticalRoad = (x % tileSize) >= (tileSize - roadWidth) / 2 && (x % tileSize) <= (tileSize + roadWidth) / 2;

    return isHorizontalRoad || isVerticalRoad;
}

function updateBuses() {
    const busArray = Object.values(buses);

    busArray.forEach((bus) => {
        if (bus.canMove) {
            bus.move();
        }
    });
}

function drawBuses() {
    if (!window.ctx || !window.canvas) {
        console.error("Error: El canvas o el contexto no están inicializados.");
        return;
    }

    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

    window.buses = Object.fromEntries(
        Object.entries(buses).filter(([id, bus]) => bus.x !== undefined && bus.y !== undefined)
    );

    console.log("Dibujando buses, total:", Object.keys(buses).length);
    console.log(buses);

    Object.entries(buses).forEach(([id, bus]) => {
        if (!isOnRoad(bus.x, bus.y)) {
            console.error(`Coordenadas inválidas para el bus ${id}`);
            const newBusPosition = generateRandomBusPosition();
            bus.x = newBusPosition.x;
            bus.y = newBusPosition.y;
            console.log(`Se generaron nuevas coordenadas para el bus ${id}:`, newBusPosition);
        }

        if (bus.x < 0) bus.x = 0;
        if (bus.x > mapWidth - bus.width) bus.x = mapWidth - bus.width;
        if (bus.y < 0) bus.y = 0;
        if (bus.y > mapHeight - bus.height) bus.y = mapHeight - bus.height;

        console.log(`Dibujando bus ${id} en X: ${bus.x}, Y: ${bus.y}`);

        window.ctx.save();
        window.ctx.translate(bus.x + bus.width / 2, bus.y + bus.height / 2);
        window.ctx.rotate(bus.angle * Math.PI / 180);

        window.ctx.fillStyle = "yellow";
        window.ctx.fillRect(-bus.width / 2, -bus.height / 2, bus.width, bus.height);

        window.ctx.fillStyle = "blue";
        const windowPositions = [5, 20, 35];
        windowPositions.forEach(offset => {
            window.ctx.fillRect(-bus.width / 2 + offset, -bus.height / 2 + 5, 10, 10);
        });
        bus.id = id;
        window.ctx.fillStyle = "black";
        [10, 40].forEach(offset => {
            window.ctx.beginPath();
            window.ctx.arc(-bus.width / 2 + offset, bus.height / 2, 5, 0, Math.PI * 2);
            window.ctx.fill();
        });

        window.ctx.restore();

        window.ctx.fillStyle = "black";
        window.ctx.font = "14px Arial";
        window.ctx.textAlign = "center";
        window.ctx.fillText(id, bus.x + bus.width / 2, bus.y - 5);
    });
    setInterval(updateBuses, 100);
}