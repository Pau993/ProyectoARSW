package edu.eci.arsw.sits.sitsgame.Back.Controller;

import java.util.HashMap;
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
    public String handleNewPlayer(String playerId) {
        if (!buses.containsKey(playerId)) {
            // 🔥 Alternar entre dos posiciones iniciales dentro de la carretera
            boolean startOnLeft = buses.size() % 2 == 0;
            int laneOffset = (TILE_SIZE - ROAD_WIDTH) / 2;
            int randomLane = random.nextBoolean() ? laneOffset : laneOffset + BUS_SIZE;
            
            int randomX;
            int randomY;
            String direction;

            if (startOnLeft) {
                randomX = 0;  // 🚍 Aparece en la izquierda (sobre la carretera)
                randomY = (random.nextInt(5) * TILE_SIZE) + randomLane;
                direction = "RIGHT";  // Se mueve hacia la derecha
            } else {
                randomX = MAP_WIDTH - BUS_SIZE;  // 🚍 Aparece en la derecha
                randomY = (random.nextInt(5) * TILE_SIZE) + randomLane;
                direction = "LEFT";  // Se mueve hacia la izquierda
            }

            Bus newBus = new Bus(playerId, randomX, randomY, messagingTemplate);
            newBus.setDirection(direction); // Asignar dirección inicial
            Thread busThread = new Thread(newBus);

            buses.put(playerId, newBus);
            busThreads.put(playerId, busThread);
            busThread.start();
        }

        // Notificar a todas las pestañas sobre el nuevo bus
        String newBusMessage = "NEW_BUS:" + playerId + "," + buses.get(playerId).getX() + "," + buses.get(playerId).getY() + "," + buses.get(playerId).getDirection();

        // Enviar TODA la lista de buses para sincronizar
        StringBuilder allBusesMessage = new StringBuilder("ALL_BUSES");
        for (Bus bus : buses.values()) {
            allBusesMessage.append(":")
                .append(bus.getPlayerId()).append(",")
                .append(bus.getX()).append(",")
                .append(bus.getY()).append(",")
                .append(bus.getDirection());
        }

        return newBusMessage + "\n" + allBusesMessage;
    }

    @MessageMapping("/move")
    public void changeBusDirection(String message) {
        String[] parts = message.split(":");
        String playerId = parts[0];
        String direction = parts[1];

        if (buses.containsKey(playerId)) {
            Bus bus = buses.get(playerId);

            // 📌 Validar movimiento en la carretera
            if (isValidMove(bus, direction)) {
                bus.setDirection(direction); // Cambia la dirección del bus
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
