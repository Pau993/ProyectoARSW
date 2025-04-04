package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class GameManager {
    private static final ConcurrentMap<String, Bus> buses = new ConcurrentHashMap<>();
    private static final ConcurrentMap<String, Thread> busThreads = new ConcurrentHashMap<>();
    private static final ConcurrentMap<String, Integer> scores = new ConcurrentHashMap<>();
    private static final List<Passenger> passengers = new ArrayList<>();
    private static final Random random = new Random();
    private static final int MAP_WIDTH = 1000;
    private static final int MAP_HEIGHT = 1000;
    private static final int COLLISION_DISTANCE = 50;

    // Add this method to the GameManager class
    
    public static List<Passenger> getPassengers() {
        return passengers;
    }

    public static void addBus(String playerId, Bus bus, Thread busThread) {
        buses.put(playerId, bus);
        busThreads.put(playerId, busThread);
    }

    public static void removeBus(String playerId) {
        Bus bus = buses.remove(playerId);
        if (bus != null) {
            Thread busThread = busThreads.remove(playerId);
            if (busThread != null && busThread.isAlive()) {
                busThread.interrupt();  // Detener el thread del bus
            }
        }
    }

    public static List<Bus> getAllBuses() {
        return new ArrayList<>(buses.values());
    }

    public static boolean containsBus(String playerId) {
        return buses.containsKey(playerId);
    }

    public static void removeInactiveBuses() {
        buses.entrySet().removeIf(entry -> {
            String playerId = entry.getKey();
            Thread busThread = busThreads.get(playerId);
            return busThread == null || !busThread.isAlive();
        });
    }

    public static Bus getBus(String playerId) {
        return buses.get(playerId);
    }


    public static void checkCollisions(String playerId, SimpMessagingTemplate messagingTemplate) {
        Bus bus = buses.get(playerId);
        if (bus != null) {
            synchronized (passengers) {
                passengers.removeIf(passenger -> {
                    if (isCollision(bus, passenger)) {
                        incrementScore(playerId);
                        generateRandomPassenger(messagingTemplate);
                        return true;
                    }
                    return false;
                });
            }
        }
    }
    

    private static boolean isCollision(Bus bus, Passenger passenger) {
        double distance = Math.sqrt(
            Math.pow(bus.getX() - passenger.getX(), 2) +
            Math.pow(bus.getY() - passenger.getY(), 2)
        );
        return distance < COLLISION_DISTANCE;
    }

    private static void incrementScore(String playerId) {
        scores.merge(playerId, 1, Integer::sum);
    }

    public static int getScore(String playerId) {
        return scores.getOrDefault(playerId, 0);
    }

    public static void initializeGame(String playerId, SimpMessagingTemplate messagingTemplate) {
        scores.put(playerId, 0);
        for (int i = 0; i < 5; i++) {
            generateRandomPassenger(messagingTemplate);
        }
    }

    public static void generateRandomPassenger(SimpMessagingTemplate messagingTemplate) {
        int x = random.nextInt(MAP_WIDTH);
        int y = random.nextInt(MAP_HEIGHT);
        Passenger newPassenger = new Passenger(x, y);
        passengers.add(newPassenger);
        
        // Enviar estado actualizado a los clientes (asumiendo uso de SimpMessagingTemplate)
        messagingTemplate.convertAndSend("/topic/game-state", newPassenger);
    }
    

    public static GameState getGameState() {
        return new GameState(buses, passengers, scores); 
    }

    public static ConcurrentMap<String, Integer> getAllScores() {
        return scores;
    }

    public static void resetGame(String playerId, SimpMessagingTemplate messagingTemplate) {
        scores.put(playerId, 0);
        passengers.clear();
        for (int i = 0; i < 5; i++) {
            generateRandomPassenger(messagingTemplate);
        }
    }

}
