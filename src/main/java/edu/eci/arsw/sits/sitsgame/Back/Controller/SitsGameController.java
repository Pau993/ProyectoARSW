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
            GameManager.initializeGame(playerId, messagingTemplate); 

            if (GameManager.getPassengers().isEmpty()) {
                for (int i = 0; i < 5; i++) {
                    GameManager.generateRandomPassenger(messagingTemplate);
                }
            }
        }

        GameManager.removeInactiveBuses();

        StringBuilder gameState = new StringBuilder("GAME_STATE");

        gameState.append(":BUSES");
        for (Bus bus : GameManager.getAllBuses()) {
            gameState.append(":")
                    .append(bus.getPlayerId()).append(",")
                    .append(bus.getX()).append(",")
                    .append(bus.getY()).append(",")
                    .append(bus.getDirection());
        }

        gameState.append(":PASSENGERS").append(new Gson().toJson(GameManager.getPassengers()));
        gameState.append(":SCORES").append(new Gson().toJson(GameManager.getAllScores()));

        return gameState.toString();
    }

    @MessageMapping("/generatePassenger")
    public void generatePassenger() {
        GameManager.generateRandomPassenger(messagingTemplate);
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
            for (Bus otherBus : GameManager.getAllBuses()) {
                if (!otherBus.getPlayerId().equals(playerId) && isCollision(bus, otherBus)) {
                    handleBusCollision(bus, otherBus);
                    return;
                }
            }

            GameManager.checkCollisions(playerId, messagingTemplate);
            bus.setDirection(direction);
            bus.allowMove();
            bus.move(GameManager.getAllBuses());

            sendGameStateUpdate();
        }
    }

    private boolean isCollision(Bus bus1, Bus bus2) {
        
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

    private void handleBusCollision(Bus bus1, Bus bus2) {
        Bus busToRemove = Math.random() < 0.5 ? bus1 : bus2;
        GameManager.removeBus(busToRemove.getPlayerId());
        messagingTemplate.convertAndSend("/topic/game", "COLLISION:" + busToRemove.getPlayerId());
    }

    private void sendGameStateUpdate() {
        String passengersJson = new Gson().toJson(GameManager.getPassengers());
        String scoresJson = new Gson().toJson(GameManager.getAllScores());

        messagingTemplate.convertAndSend("/topic/game", "UPDATE:PASSENGERS:" + passengersJson);
        messagingTemplate.convertAndSend("/topic/game", "UPDATE:SCORES:" + scoresJson);
    }

    @MessageMapping("/reset")
    public void resetGame(String playerId) {
        GameManager.resetGame(playerId, messagingTemplate);
        sendGameStateUpdate();
    }

}
