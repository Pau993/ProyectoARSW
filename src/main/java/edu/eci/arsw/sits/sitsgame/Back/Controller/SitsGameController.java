package edu.eci.arsw.sits.sitsgame.Back.Controller;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.sits.sitsgame.Back.Model.Bus;

@Controller
public class SitsGameController {
    
    private final Map<String, Bus> buses = new HashMap<>();
    private final Map<String, Thread> busThreads = new HashMap<>();
    private final Random random = new Random();
    
    private final int TILE_SIZE = 200;  // Tamaño de cada tile
    private final int MAP_WIDTH = TILE_SIZE * 5;  // 5x5 tiles
    private final int MAP_HEIGHT = TILE_SIZE * 5;
    private final int BUS_SIZE = 50;  // Tamaño del bus
    private final int ROAD_WIDTH = BUS_SIZE * 2;  // Ancho de la carretera

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/join")
    @SendTo("/topic/game")
    public synchronized String handleNewPlayer(String playerId) {
        if (!buses.containsKey(playerId)) {
            boolean startOnLeft = buses.size() % 2 == 0;
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

            buses.put(playerId, newBus);
            busThreads.put(playerId, busThread);
            busThread.start();
        }

        removeInactiveBuses(); // Eliminar buses huérfanos

        StringBuilder allBusesMessage = new StringBuilder("ALL_BUSES");
        for (Bus bus : buses.values()) {
            allBusesMessage.append(":")
                .append(bus.getPlayerId()).append(",")
                .append(bus.getX()).append(",")
                .append(bus.getY()).append(",")
                .append(bus.getDirection());
        }

        return allBusesMessage.toString();
    }

    @MessageMapping("/move")
    public synchronized void changeBusDirection(String message) {
        String[] parts = message.split(":");
        if (parts.length < 2) return;

        String playerId = parts[0];
        String direction = parts[1];

        if (buses.containsKey(playerId)) {
            Bus bus = buses.get(playerId);

            if (isValidMove(bus, direction)) {
                bus.setDirection(direction);
                bus.allowMove();
                bus.move();
            }
        }
    }

    private synchronized void removeInactiveBuses() {
        Iterator<Map.Entry<String, Bus>> iterator = buses.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, Bus> entry = iterator.next();
            if (!busThreads.containsKey(entry.getKey())) {
                iterator.remove();
            }
        }
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
