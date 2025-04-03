package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class GameManager {
    private static final ConcurrentMap<String, Bus> buses = new ConcurrentHashMap<>();
    private static final ConcurrentMap<String, Thread> busThreads = new ConcurrentHashMap<>();
    private static final List<Passenger> passengers = new ArrayList<>();
    private static final Random random = new Random();
    private static final int MAP_WIDTH = 1000;
    private static final int MAP_HEIGHT = 1000;

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


    public static List<Passenger> getPassengers() {
        return passengers;
    }

    public static void generateRandomPassenger() {
        int x = random.nextInt(MAP_WIDTH);
        int y = random.nextInt(MAP_HEIGHT);
        Passenger newPassenger = new Passenger(x, y);
        passengers.add(newPassenger);
    }

}
