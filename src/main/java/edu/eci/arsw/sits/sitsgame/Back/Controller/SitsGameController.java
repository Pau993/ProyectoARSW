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
    private final int MAP_WIDTH = 500;
    private final int MAP_HEIGHT = 500;
    private final int BUS_SIZE = 50;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/join")
    @SendTo("/topic/game")
    public String handleNewPlayer(String playerId) {
        if (!buses.containsKey(playerId)) {
            int randomX = random.nextInt(MAP_WIDTH - BUS_SIZE);
            int randomY = random.nextInt(MAP_HEIGHT - BUS_SIZE);
            Bus newBus = new Bus(playerId, randomX, randomY, messagingTemplate);
            Thread busThread = new Thread(newBus);

            buses.put(playerId, newBus);
            busThreads.put(playerId, busThread);
            busThread.start(); // 🚀 Inicia el hilo del bus
        }

        // Notificar a todas las pestañas sobre el nuevo bus
        String newBusMessage = "NEW_BUS:" + playerId + "," + buses.get(playerId).getX() + "," + buses.get(playerId).getY();

        // Enviar TODA la lista de buses para sincronizar
        StringBuilder allBusesMessage = new StringBuilder("ALL_BUSES");
        for (Bus bus : buses.values()) {
            allBusesMessage.append(":").append(bus.getPlayerId()).append(",").append(bus.getX()).append(",").append(bus.getY());
        }

        return newBusMessage + "\n" + allBusesMessage;
    }

    @MessageMapping("/move")
    public void changeBusDirection(String message) {
        String[] parts = message.split(":");
        String playerId = parts[0];
        String direction = parts[1];

        if (buses.containsKey(playerId)) {
            buses.get(playerId).setDirection(direction); // Cambia la dirección del bus
        }
    }
}