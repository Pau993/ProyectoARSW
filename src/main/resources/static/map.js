let obstacles = []; // Variable global para almacenar los obstáculos
let constructionSigns = [];
let people = []; // Variable global para almacenar las personas
let peopleGenerated = false; // Variable para controlar la generación única
let score = 0; // Variable para almacenar el puntaje
let gameOver = false; // Variable para controlar el estado del juego
let globalScores = {};
let buses = {}; // Variable global para almacenar los buses

function createMap() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const tileSize = 200; // Tamaño de cada tile
  const mapSize = 5; // Tamaño del mapa (5x5)

  const busWidth = 50; // Ancho de un autobús
  const roadWidth = busWidth * 2; // Ancho total de la carretera para dos autobuses
  const laneWidth = busWidth; // Ancho de cada carril

  ctx.fillStyle = "#90EE90"; // Verde claro (césped)
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar carretera
  function drawRoad(x, y, horizontal, vertical) {
    ctx.fillStyle = "#4a4a4a"; // Gris oscuro para la carretera

    if (horizontal)
      ctx.fillRect(x, y + (tileSize - roadWidth) / 2, tileSize, roadWidth);
    if (vertical)
      ctx.fillRect(x + (tileSize - roadWidth) / 2, y, roadWidth, tileSize);

    ctx.strokeStyle = "#FFFFFF"; // Líneas de carril blancas
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);

    if (horizontal) {
      ctx.beginPath();
      ctx.moveTo(x, y + tileSize / 2 - laneWidth / 2);
      ctx.lineTo(x + tileSize, y + tileSize / 2 - laneWidth / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y + tileSize / 2 + laneWidth / 2);
      ctx.lineTo(x + tileSize, y + tileSize / 2 + laneWidth / 2);
      ctx.stroke();

      ctx.strokeStyle = "#FFD700"; // Línea central amarilla
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x, y + tileSize / 2);
      ctx.lineTo(x + tileSize, y + tileSize / 2);
      ctx.stroke();
    }

    if (vertical) {
      ctx.beginPath();
      ctx.moveTo(x + tileSize / 2 - laneWidth / 2, y);
      ctx.lineTo(x + tileSize / 2 - laneWidth / 2, y + tileSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + tileSize / 2 + laneWidth / 2, y);
      ctx.lineTo(x + tileSize / 2 + laneWidth / 2, y + tileSize);
      ctx.stroke();

      ctx.strokeStyle = "#FFD700"; // Línea central amarilla
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x + tileSize / 2, y);
      ctx.lineTo(x + tileSize / 2, y + tileSize);
      ctx.stroke();
    }
  }

  // Dibujar carreteras en todas las posiciones
  for (let x = 0; x < mapSize; x++) {
    for (let y = 0; y < mapSize; y++) {
      drawRoad(x * tileSize, y * tileSize, true, true);
    }
  }

  // Función para dibujar un edificio con borde negro
  function drawBuilding(x, y, color) {
    let buildingSize = tileSize * 0.3;
    let offset = (tileSize - buildingSize) / 2;

    let baseX = x * tileSize + offset;
    let baseY = y * tileSize + offset;

    ctx.fillStyle = color;
    ctx.fillRect(baseX, baseY, buildingSize, buildingSize);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(baseX, baseY, buildingSize, buildingSize);
  }

  // Colocar edificios en el mapa
  const buildings = [
    { x: 1.5, y: 0.5, color: "#F9C5D1" }, // Pastel Rosa Claro
    { x: 1.5, y: 1.5, color: "#A8D0E6" }, // Pastel Azul Claro
    { x: 1.5, y: 2.5, color: "#EEC9B7" }, // Pastel Melocotón Claro
    { x: 1.5, y: 3.5, color: "#B9E3B6" }, // Pastel Verde Claro
    { x: 1.5, y: 4.5, color: "#E6A3D9" }, // Pastel Lavanda
    { x: 0.5, y: 0.5, color: "#FFD4DA" }, // Pastel Rosa Claro
    { x: 0.5, y: 1.5, color: "#C0E8D5" }, // Pastel Aqua Suave
    { x: 0.5, y: 2.5, color: "#F1C8B2" }, // Pastel Naranja Suave
    { x: 0.5, y: 3.5, color: "#C7E5C6" }, // Pastel Verde Suave
    { x: 0.5, y: 4.5, color: "#F6C9D7" }, // Pastel Coral Claro
    { x: 2.5, y: 0.5, color: "#FFB4C0" }, // Pastel Rosa Suave
    { x: 2.5, y: 1.5, color: "#B1D9D4" }, // Pastel Aqua Claro
    { x: 2.5, y: 2.5, color: "#FFEBB7" }, // Pastel Amarillo Claro
    { x: 2.5, y: 3.5, color: "#A2C9F3" }, // Pastel Azul Claro
    { x: 2.5, y: 4.5, color: "#E8D0F2" }, // Pastel Lila Claro
    { x: 3.5, y: 0.5, color: "#F6E3D6" }, // Pastel Beige
    { x: 3.5, y: 1.5, color: "#C1D7E0" }, // Pastel Aqua Claro
    { x: 3.5, y: 2.5, color: "#F8D0C4" }, // Pastel Rosado Claro
    { x: 3.5, y: 3.5, color: "#C1D9E7" }, // Pastel Azul Suave
    { x: 3.5, y: 4.5, color: "#D4A2D8" }, // Pastel Lila Claro
    { x: 4.5, y: 0.5, color: "#FFD1E1" }, // Pastel Rosa Suave
    { x: 4.5, y: 1.5, color: "#B6D8F6" }, // Pastel Azul Claro
    { x: 4.5, y: 2.5, color: "#E4F2B7" }, // Pastel Verde Claro
    { x: 4.5, y: 3.5, color: "#F0C2B6" }, // Pastel Naranja Claro
    { x: 4.5, y: 4.5, color: "#D6B5E6" }, // Pastel Lavanda Claro
    { x: -0.5, y: 0.5, color: "#F7D2A1" }, // Pastel Amarillo Claro
    { x: -0.5, y: 1.5, color: "#F3D2E6" }, // Pastel Rosa Claro
    { x: -0.5, y: 2.5, color: "#B6E2B3" }, // Pastel Verde Suave
    { x: -0.5, y: 3.5, color: "#FFBC9A" }, // Pastel Naranja Claro
    { x: -0.5, y: 4.5, color: "#FFBDC6" }, // Pastel Rojo Suave
    { x: -0.5, y: -0.5, color: "#F2A3B7" }, // Pastel Rosa
    { x: 0.5, y: -0.5, color: "#F9D6A0" }, // Pastel Amarillo Claro
    { x: 1.5, y: -0.5, color: "#E4D4F3" }, // Pastel Lila Claro
    { x: 2.5, y: -0.5, color: "#F8C3A1" }, // Pastel Melocotón Claro
    { x: 3.5, y: -0.5, color: "#C9D9F7" }, // Pastel Azul Claro
    { x: 4.5, y: -0.5, color: "#FFD9E1" }, // Pastel Rosa Suave
  ];
  buildings.forEach((building) =>
    drawBuilding(building.x, building.y, building.color)
  );

  // Función para dibujar un obstáculo circular
  function drawObstacle(x, y) {
    const obstacleRadius = 15; // Radio del obstáculo
    ctx.fillStyle = "#3A2B17"; // Negro
    ctx.beginPath();
    ctx.arc(x, y, obstacleRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Función para generar los obstáculos
  function generateObstacles(numObstacles) {
    if (obstacles.length === 0) {
      // Solo generar si no hay obstáculos
      for (let i = 0; i < numObstacles; i++) {
        const tileX = Math.floor(Math.random() * mapSize);
        const tileY = Math.floor(Math.random() * mapSize);

        // Posición aleatoria dentro de la carretera del tile
        const offsetX = (tileSize - roadWidth) / 2 + Math.random() * roadWidth;
        const offsetY = (tileSize - roadWidth) / 2 + Math.random() * roadWidth;

        const obstacleX = tileX * tileSize + offsetX;
        const obstacleY = tileY * tileSize + offsetY;

        obstacles.push({ x: obstacleX, y: obstacleY });
      }
    }
  }

  // Función para dibujar letreros de construcción en forma de triángulo
  function drawConstructionSign(x, y) {
    const base = 30; // Base del triángulo
    const height = 40; // Altura del triángulo

    // Coordenadas del triángulo (punta arriba)
    const x1 = x;
    const y1 = y - height / 2;
    const x2 = x - base / 2;
    const y2 = y + height / 2;
    const x3 = x + base / 2;
    const y3 = y + height / 2;

    // Fondo amarillo
    ctx.fillStyle = "#FFFF00";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();

    // Triángulo negro
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();

    // Texto de "Construcción"
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Arial";
    ctx.fillText("Construcción", x - 15, y - height / 2 - 5);
  }

  // Función para generar los letreros de construcción de forma aleatoria
  function generateConstructionSigns(numSigns) {
    if (constructionSigns.length === 0) {
      let attempts = 0;
      while (constructionSigns.length < numSigns && attempts < 100) {
        // Evita bucles infinitos
        const tileX = Math.floor(Math.random() * mapSize);
        const tileY = Math.floor(Math.random() * mapSize);

        const offsetX = (tileSize - roadWidth) / 2 + Math.random() * roadWidth;
        const offsetY = (tileSize - roadWidth) / 2 + Math.random() * roadWidth;

        const signX = tileX * tileSize + offsetX;
        const signY = tileY * tileSize + offsetY;

        if (!isPositionOccupied(signX, signY)) {
          // Solo agrega si está libre
          constructionSigns.push({ x: signX, y: signY });
        }

        attempts++; // Controla intentos para evitar bucles infinitos
      }
    }
  }



  // Función para dibujar una persona
  function drawPerson(x, y, bodyColor, skinColor) {
    const personRadius = 10; // Radio de la persona

    // Cuerpo
    ctx.fillStyle = bodyColor || getRandomPersonColor(); // Color de cuerpo
    ctx.beginPath();
    ctx.arc(x, y, personRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "black"; // Contorno negro
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cabeza
    ctx.fillStyle = skinColor || getRandomSkinColor(); // Color de piel
    ctx.beginPath();
    ctx.arc(x, y - personRadius * 1.5, personRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "black"; // Contorno negro
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Función para obtener un color aleatorio para la persona
  function getRandomPersonColor() {
    const colors = [
      "#FF6347",
      "#4682B4",
      "#2E8B57",
      "#8A2BE2",
      "#FF4500",
      "#1E90FF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Función para obtener un color de piel aleatorio
  function getRandomSkinColor() {
    const skinColors = ["#FFA07A", "#DEB887", "#D2B48C", "#F4A460", "#CD853F"];
    return skinColors[Math.floor(Math.random() * skinColors.length)];
  }

  // Función para generar personas en la carretera
  window.generatePeople =function(passengerData) {
    if (!Array.isArray(passengerData)) return;

    window.passengers = {}; // limpiar anteriores

    passengerData.forEach((p) => {
      window.passengers[p.id] = {
        x: p.x,
        y: p.y,
        isPickedUp: p.isPickedUp,
      };
    });
    
    drawPassengers(); // función que deberías tener para pintarlo
  }


  function drawPassengers() {
    if (!window.passengers) return;
  
    Object.values(window.passengers).forEach((p) => {
      if (!p.isPickedUp) {
        drawPerson(p.x, p.y); // Usa colores aleatorios por defecto
      }
    });
  }
  

  //Verificar si el bus pasa sobre una persona
  function checkCollisionWithPeople(busX, busY, busId) {
    // Esta función ahora debe escuchar los eventos del servidor
    // en lugar de manejar las colisiones localmente
    socket.send(
      "/app/checkCollision",
      {},
      JSON.stringify({
        busId: busId,
        x: busX,
        y: busY,
      })
    );
  }
  function handleScoreUpdate(scoreData) {
    globalScores = scoreData;
    updateGlobalScore();
  }
  function drawBuses() {
    if (!window.ctx || !window.canvas) {
      console.error("Error: El canvas o el contexto no están inicializados.");
      return;
    }

    // Limpiar el canvas antes de redibujar
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

    createMap(); // Redibuja el mapa

    Object.entries(buses).forEach(([id, bus]) => {
      if (bus.x !== undefined && bus.y !== undefined) {
        console.log(`Dibujando bus ${id} en X: ${bus.x}, Y: ${bus.y}`);
        drawBus(bus.x, bus.y, bus.angle); // Llama a la función para dibujar el bus
      } else {
        console.error(`El bus ${id} no tiene coordenadas válidas.`);
      }
    });
  }

  // Función para escuchar mensajes del servidor
  function connectWebSocket() {
    const socket = new SockJS("/game-websocket");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);

      // Suscribirse a actualizaciones de pasajeros
      stompClient.subscribe("/topic/game", function (message) {
        const data = JSON.parse(message.body);
        if (data.type === "UPDATE:PASSENGERS") {
          updatePassengers(data.passengers);
        } else if (data.type === "UPDATE:SCORES") {
          handleScoreUpdate(data.scores);
        } else if (data.type === "COLLISION") {
          handleCollision(data.busId);
        } else if (data.type === "SCORE") {
          score = data.score;
          updateScore(); // Actualiza la puntuación en el canvas
        } else if (data.type === "UPDATE:BUSES") {
          buses = data.buses; // Actualiza la lista de buses
          drawBuses(); // Redibuja los buses en el canvas
        }
      });
    });
  }

  // Función para actualizar la puntuación en el canvas
  function updateScore() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Definir el texto y su posición fija
    const text = "Puntuación: " + score;
    ctx.font = "bold 20px Arial";

    // Ancho fijo para el fondo
    const boxWidth = 200; // Mantiene el tamaño del fondo estable
    const boxHeight = 30;
    const x = (canvas.width - boxWidth) / 2;
    const y = 30; // Posición en la parte superior

    // Dibujar fondo semitransparente
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Negro con 50% de opacidad
    ctx.fillRect(x, y - 20, boxWidth, boxHeight);

    // Dibujar el texto centrado dentro del fondo
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, y);
  }

  // Modificar para usar el sistema de puntuación del servidor
  function updateGlobalScore() {
    const scoreElement = document.getElementById("scoreBoard");
    let scoreHtml = "<h2>Puntuaciones</h2>";
    Object.entries(globalScores).forEach(([busId, score]) => {
      scoreHtml += `<p>Bus ${busId}: ${score}</p>`;
    });
    scoreElement.innerHTML = scoreHtml;
  }

  // Dibujar las personas en el mapa
  function drawPeople() {
    console.log(" Iniciando drawPeople...");
    console.log("Estado actual de pasajeros:", window.passengers);

    if (Object.keys(window.passengers).length === 0) {
      console.warn("⚠️ No hay pasajeros para dibujar");
      return;
    }

    Object.entries(window.passengers).forEach(([id, passenger]) => {
      console.log(
        `Dibujando pasajero ID: ${id} en (${passenger.x}, ${passenger.y})`
      );
      drawPerson(
        passenger.x,
        passenger.y,
        passenger.bodyColor,
        passenger.skinColor
      );
    });

    console.log("Finalizado el dibujado de personas");
  }

  // Dibujar los obstáculos en el mapa
  function drawObstacles() {
    obstacles.forEach((obstacle) => drawObstacle(obstacle.x, obstacle.y));
  }

  function isPositionOccupied(x, y) {
    const minDistance = 30; // Minimum distance between objects

    // Check obstacles
    const hasObstacle = obstacles.some(
      (obstacle) => Math.hypot(obstacle.x - x, obstacle.y - y) < minDistance
    );
    if (hasObstacle) return true;

    // Check construction signs
    const hasSign = constructionSigns.some(
      (sign) => Math.hypot(sign.x - x, sign.y - y) < minDistance
    );
    if (hasSign) return true;

    // Sustituir en isPositionOccupied:
    const hasPerson = Object.values(window.passengers || {}).some(
      (passenger) => Math.hypot(passenger.x - x, passenger.y - y) < minDistance
    );

    return hasPerson;
  }

  // Dibujar todas las señales generadas
  constructionSigns.forEach((sign) => drawConstructionSign(sign.x, sign.y));

  // Inicialización y dibujado
  updateScore(); // Actualiza la puntuación
  generateObstacles(10);
  drawObstacles();
  generateConstructionSigns(5);
  generatePeople(6); // Genera 8 personas
  drawPeople(); // Dibuja las personas
}

// Cargar mapa al inicio
window.addEventListener("DOMContentLoaded", createMap);
