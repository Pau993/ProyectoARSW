
package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.List;
import java.util.Map;

public class GameState {
    private Map<String, Bus> buses;
    private List<Passenger> passengers;
    private Map<String, Integer> scores;

    public GameState() {
    }

    public GameState(Map<String, Bus> buses, List<Passenger> passengers, Map<String, Integer> scores) {
        this.buses = buses;
        this.passengers = passengers;
        this.scores = scores;
    }

    public Map<String, Bus> getBuses() {
        return buses;
    }

    public void setBuses(Map<String, Bus> buses) {
        this.buses = buses;
    }

    public List<Passenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }

    public Map<String, Integer> getScores() {
        return scores;
    }

    public void setScores(Map<String, Integer> scores) {
        this.scores = scores;
    }
}
