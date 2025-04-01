package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class GameManager {
    private static final ConcurrentMap<String, Bus> buses = new ConcurrentHashMap<>();
    private static final ConcurrentMap<String, Thread> busThreads = new ConcurrentHashMap<>();

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
        // Implementar lógica para remover buses inactivos si es necesario
        // Ejemplo: iterar sobre los buses y verificar si están inactivos
        buses.entrySet().removeIf(entry -> {
            String playerId = entry.getKey();
            Thread busThread = busThreads.get(playerId);
            return busThread == null || !busThread.isAlive();
        });
    }

    public static Bus getBus(String playerId) {
        return buses.get(playerId);
    }
}
