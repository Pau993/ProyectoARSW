package edu.eci.arsw.sits.sitsgame.Back.Controller;

import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;

import edu.eci.arsw.sits.sitsgame.Back.Model.Bus;
import edu.eci.arsw.sits.sitsgame.Back.Model.GameManager;
import edu.eci.arsw.sits.sitsgame.Back.Model.Passenger;

@Controller
public class SitsGameController {

    private final Random random = new Random();

    private final int TILE_SIZE = 200; // Tamaño de cada tile
    private final int MAP_WIDTH = TILE_SIZE * 5; // 5x5 tiles
    private final int MAP_HEIGHT = TILE_SIZE * 5;
    private final int BUS_SIZE = 50; // Tamaño del bus
    private final int ROAD_WIDTH = BUS_SIZE * 2; // Ancho de la carretera

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/join")
    @SendTo("/topic/game")
    public synchronized String handleNewPlayer(String playerId) {
        if (!GameManager.containsBus(playerId)) {
            boolean startOnLeft = GameManager.getAllBuses().size() % 2 == 0;
            int laneOffset = (TILE_SIZE - ROAD_WIDTH) / 2;
            int randomLane = random.nextBoolean() ? laneOffset : laneOffset + BUS_SIZE;

            int randomX;
            int randomY;
            String direction;

            if (startOnLeft) {
                randomX = 0;
                randomY = (random.nextInt(5) * TILE_SIZE) + randomLane;
                direction = "RIGHT";
            } else {
                randomX = MAP_WIDTH - BUS_SIZE;
                randomY = (random.nextInt(5) * TILE_SIZE) + randomLane;
                direction = "LEFT";
            }

            Bus newBus = new Bus(playerId, direction, randomX, randomY, messagingTemplate);
            newBus.setDirection(direction);
            Thread busThread = new Thread(newBus);

            GameManager.addBus(playerId, newBus, busThread);
            busThread.start();
        }

        GameManager.removeInactiveBuses(); // Eliminar buses huérfanos

        StringBuilder allBusesMessage = new StringBuilder("ALL_BUSES");
        for (Bus bus : GameManager.getAllBuses()) {
            allBusesMessage.append(":")
                    .append(bus.getPlayerId()).append(",")
                    .append(bus.getX()).append(",")
                    .append(bus.getY()).append(",")
                    .append(bus.getDirection());
        }

        return allBusesMessage.toString();
    }

    @MessageMapping("/generatePassenger")
    public void generatePassenger() {
        int cantidad = 5;

        if (GameManager.getPassengers().isEmpty()) {
            System.out.println("🟡 Lista de pasajeros vacía, generando " + cantidad + " nuevos pasajeros...");

            for (int i = 0; i < cantidad; i++) {
                GameManager.generateRandomPassenger(messagingTemplate);
            }
        } else {
            System.out.println("🟢 Lista de pasajeros NO está vacía. Enviando los existentes.");
        }

        List<Passenger> passengers = GameManager.getPassengers();
        String passengersJson = "PASSENGERS" + new Gson().toJson(passengers);
        messagingTemplate.convertAndSend("/topic/game", passengersJson);
    }

    @MessageMapping("/move")
    public synchronized void changeBusDirection(String message) {
        String[] parts = message.split(":");
        if (parts.length < 2)
            return;

        String playerId = parts[0];
        String direction = parts[1];

        Bus bus = GameManager.getBus(playerId);
        if (bus != null && isValidMove(bus, direction)) {
            // Verificar si hay colisión con otro bus
            for (Bus otherBus : GameManager.getAllBuses()) {
                if (!otherBus.getPlayerId().equals(playerId)) {
                    // Verificar colisión con otro bus
                    if (isCollision(bus, otherBus)) {
                        // Elegir aleatoriamente qué bus eliminar
                        Bus busToRemove = Math.random() < 0.5 ? bus : otherBus;
                        GameManager.removeBus(busToRemove.getPlayerId()); // Eliminar el bus elegido
                        messagingTemplate.convertAndSend("/topic/game", "COLLISION:" + busToRemove.getPlayerId());
                        return; // Salir después de eliminar el bus
                    }
                }
            }

            // Si no hay colisión, mover el bus
            bus.setDirection(direction);
            bus.allowMove();
            bus.move(GameManager.getAllBuses());
        }
    }

    private boolean isCollision(Bus bus1, Bus bus2) {
        // Detecta colisión entre dos buses. La lógica puede variar según cómo defines
        // colisión.
        return bus1.getX() < bus2.getX() + BUS_SIZE &&
                bus1.getX() + BUS_SIZE > bus2.getX() &&
                bus1.getY() < bus2.getY() + BUS_SIZE &&
                bus1.getY() + BUS_SIZE > bus2.getY();
    }

    private boolean isValidMove(Bus bus, String direction) {
        int x = bus.getX();
        int y = bus.getY();

        switch (direction) {
            case "UP":
                return (y > 0) && (x % TILE_SIZE >= (TILE_SIZE - ROAD_WIDTH) / 2);
            case "DOWN":
                return (y < MAP_HEIGHT - BUS_SIZE) && (x % TILE_SIZE >= (TILE_SIZE - ROAD_WIDTH) / 2);
            case "LEFT":
                return (x > 0) && (y % TILE_SIZE >= (TILE_SIZE - ROAD_WIDTH) / 2);
            case "RIGHT":
                return (x < MAP_WIDTH - BUS_SIZE) && (y % TILE_SIZE >= (TILE_SIZE - ROAD_WIDTH) / 2);
            default:
                return false;
        }
    }
}