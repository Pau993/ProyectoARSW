window.buses = {}; // Objeto para almacenar los buses
window.passengers = {}; // Objeto global para pasajeros

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

  // Verificar si la conexión WebSocket está guardada en sessionStorage
  if (sessionStorage.getItem("wsConnected") !== "true") {
    console.error("No hay conexión WebSocket guardada.");
    alert("No estás conectado al WebSocket. Regresando a la página principal.");
    window.location.href = "index.html";
    return;
  }

  console.log(
    "Conexión WebSocket detectada en sessionStorage. Intentando reconectar..."
  );
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
    },
  });
  window.client.activate();
}

function suscribirEventos() {
  const playerId = window.playerId || localStorage.getItem("playerId");

  // Verificar si playerId está definido
  if (!playerId) {
    console.error(
      "Error: playerId no definido. Asegúrate de que el usuario esté registrado."
    );
    return;
  }

  window.client.subscribe("/topic/game", (message) => {
    console.log("Mensaje recibido del servidor:", message.body);

    const lines = message.body.split("\n");
    lines.forEach((line) => {
      const data = line.split(":");

      if (data[0] === "NEW_BUS") {
        const [id, x, y, plate] = data[1].split(",");
        if (plate && plate !== "") {
          buses[id] = {
            x: parseInt(x),
            y: parseInt(y),
            width: 50,
            height: 30,
            angle: 0,
            plate: plate,
          };
          console.log(
            `Nuevo bus registrado: ID=${id}, X=${x}, Y=${y}, Placa=${plate}`
          );
        }
      } else if (data[0] === "ALL_BUSES") {
        buses = {}; // Reiniciar solo la lista global de buses
        for (let i = 1; i < data.length; i++) {
          const [id, plate, x, y, direction] = data[i].split(",");
          if (plate && plate !== "") {
            // Asegurarse de que solo se añaden buses con placas
            buses[id] = {
              x: parseInt(x),
              y: parseInt(y),
              width: 50,
              height: 30,
              angle: direction === "LEFT" || direction === "RIGHT" ? 0 : 90,
              plate: plate,
            };
          }
        }
      } else if (data[0] === "BUS") {
        const [id, x, y, angle, plate] = data[1].split(",");
        if (buses[id]) {
          buses[id].x = parseInt(x);
          buses[id].y = parseInt(y);
          buses[id].angle = parseFloat(angle); // Actualizar la orientación
          buses[id].plate = plate; // Actualizar la placa
        }
      } else if (data[0].startsWith("COLLISION")) {
        const [collisionData, outData] = message.body.split("|");
        const collided = collisionData.replace("COLLISION:", "").split(",");

        if (collided.length < 2) {
          console.warn("⚠️ Colisión reportada con menos de 2 buses:", collided);
        } else {
          console.log("💥 Colisión entre:", collided.join(", "));
        }

        if (outData && outData.startsWith("OUT:")) {
          const outBus = outData.replace("OUT:", "");
          console.log("🗑️ Eliminando bus:", outBus);
          delete buses[outBus];

          if (outBus ===playerId) {
            showGameOverPopup();
            setTimeout(closeConnection, 2000);
          }
        }
      } else if (message.body.startsWith("PASSENGERS")) {
        const passengerData = JSON.parse(message.body.substring(10));
        console.log("Mensaje recibido del servidor: PASAJEROS", passengerData);
        if (Array.isArray(passengerData) && passengerData.length > 0) {
          console.log(`✅ ${passengerData.length} pasajeros recibidos.`);
          generatePeople(passengerData); // ✅ Aquí va el render
        } else {
          console.warn("⚠️ No se recibieron pasajeros o la lista está vacía.");
        }
      }
    });
    drawBuses(); // Dibujar solo los buses con placas
    updateBuses(); // Actualizar la posición de los buses
  });

  // Enviar solicitud para unirse al juego
  console.log("Enviando solicitud de conexión para", playerId);
  window.client.publish({ destination: "/app/join", body: playerId });

  // Capturar teclas y cambiar dirección
  document.addEventListener("keydown", (event) => {
    let direction = null;
    switch (event.key) {
      case "ArrowUp":
        direction = "UP";
        break;
      case "ArrowDown":
        direction = "DOWN";
        break;
      case "ArrowLeft":
        direction = "LEFT";
        break;
      case "ArrowRight":
        direction = "RIGHT";
        break;
    }
    if (direction && window.client.connected) {
      console.log("Enviando movimiento:", direction);
      window.client.publish({
        destination: "/app/move",
        body: playerId + ":" + direction,
      });
    }
  });

  function requestPassengers() {
    if (window.client.connected) {
      window.client.publish({
        destination: "/app/generatePassenger",
        body: "",
      });
    }
  }

  setTimeout(requestPassengers, 1000);

  function showGameOverPopup() {
    const popup = document.getElementById("gameOverPopup");
    if (popup) {
      popup.style.display = "block";
    }
  }


  function closeConnection() {
    if (window.client && window.client.connected) {
      window.client.deactivate(); // ✅ cierra la conexión STOMP segura
      console.log("🔌 Desconectado del servidor tras colisión");
      setTimeout(() => {
        window.location.href = "index.html"; // o reload si prefieres
      }, 1000);
    } else {
      window.location.href = "index.html"; // fallback por si no está conectado
    }
  }
  
}
