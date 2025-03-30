function createMap() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const tileSize = 100; // Tamaño de cada tile
    const mapSize = 10; // Tamaño del mapa (10x10)
    
    // Nuevo: Ancho de carretera más grande
    const roadWidth = 60; // Ancho total de la carretera
    const laneWidth = 25; // Ancho de cada carril
    const centerLineWidth = 5; // Ancho de la línea central

    // Fondo verde
    ctx.fillStyle = '#90EE90'; // Verde claro
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Función para dibujar carretera
    function drawRoad(x, y, horizontal, vertical, hasLines = true) {
        // Color base de la carretera
        ctx.fillStyle = '#4a4a4a'; // Gris más oscuro

        // Dibujar carretera base
        if (horizontal) {
            // Carretera horizontal más ancha
            ctx.fillRect(x, y + (tileSize - roadWidth) / 2, tileSize, roadWidth);
        }
        if (vertical) {
            // Carretera vertical más ancha
            ctx.fillRect(x + (tileSize - roadWidth) / 2, y, roadWidth, tileSize);
        }

        // Dibujar líneas divisorias
        if (hasLines) {
            ctx.strokeStyle = '#FFFFFF'; // Línea blanca
            ctx.lineWidth = 3;
            
            // Línea central discontinua
            ctx.setLineDash([20, 20]);

            if (horizontal) {
                // Línea central horizontal
                ctx.beginPath();
                ctx.moveTo(x, y + tileSize / 2);
                ctx.lineTo(x + tileSize, y + tileSize / 2);
                ctx.stroke();
            }
            
            if (vertical) {
                // Línea central vertical
                ctx.beginPath();
                ctx.moveTo(x + tileSize / 2, y);
                ctx.lineTo(x + tileSize / 2, y + tileSize);
                ctx.stroke();
            }
        }
    }

    // Generar todas las carreteras
    const roadPositions = [];

    // Carreteras horizontales en todas las filas
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            roadPositions.push({x, y, horizontal: true, vertical: false});
        }
    }

    // Carreteras verticales en todas las columnas
    for (let x = 0; x < mapSize; x++) {
        for (let y = 0; y < mapSize; y++) {
            roadPositions.push({x, y, horizontal: false, vertical: true});
        }
    }

    // Dibujar todas las carreteras
    roadPositions.forEach(road => {
        drawRoad(
            road.x * tileSize, 
            road.y * tileSize, 
            road.horizontal, 
            road.vertical
        );
    });

    // Intersecciones (todas las combinaciones)
    for (let x = 0; x < mapSize; x++) {
        for (let y = 0; y < mapSize; y++) {
            drawRoad(
                x * tileSize, 
                y * tileSize, 
                true, 
                true
            );
        }
    }
}

// Llamar a createMap cuando la página se cargue
window.addEventListener('load', createMap);
