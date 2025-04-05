package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.messaging.simp.SimpMessagingTemplate;

public class GameManager {
    private static final ConcurrentMap<String, Bus> buses = new ConcurrentHashMap<>();
    private static final ConcurrentMap<String, Thread> busThreads = new ConcurrentHashMap<>();
    private static final ConcurrentMap<String, Integer> scores = new ConcurrentHashMap<>();
    private static final List<Passenger> passengers = new CopyOnWriteArrayList<>();

    private static final Random random = new Random();
    private static final int MAP_WIDTH = 1000;
    private static final int MAP_HEIGHT = 1000;

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
                busThread.interrupt(); // Detener el thread del bus
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

    public static void detectAndHandleBusCollision(String playerId, SimpMessagingTemplate messagingTemplate) {
        Bus bus = buses.get(playerId);
        if (bus == null)
            return;

        for (Bus otherBus : getAllBuses()) {
            if (!otherBus.getPlayerId().equals(playerId)) {
                if (isCollision(bus, otherBus)) {
                    String bus1 = bus.getPlayerId();
                    String bus2 = otherBus.getPlayerId();

                    String toRemove = Math.random() < 0.5 ? bus1 : bus2;

                    removeBus(toRemove);

                    String message = String.format("COLLISION:%s,%s|OUT:%s", bus1, bus2, toRemove);
                    messagingTemplate.convertAndSend("/topic/game", message);

                    break;
                }
            }
        }
    }

    private static boolean isCollision(Bus bus1, Bus bus2) {
        int BUS_SIZE = 40; // ajusta esto al tamaño real de los buses
        return bus1.getX() < bus2.getX() + BUS_SIZE &&
                bus1.getX() + BUS_SIZE > bus2.getX() &&
                bus1.getY() < bus2.getY() + BUS_SIZE &&
                bus1.getY() + BUS_SIZE > bus2.getY();
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
        synchronized (passengers) {
            passengers.add(newPassenger);
        }
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

    public static void clearPassengers() {
        passengers.clear();
    }

}
