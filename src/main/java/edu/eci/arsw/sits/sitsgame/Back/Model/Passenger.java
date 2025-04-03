package edu.eci.arsw.sits.sitsgame.Back.Model;

public class Passenger {
    private int x;
    private int y;
    private boolean isPickedUp;
    private String id;
    private static int nextId = 1;
    
    public Passenger(int x, int y) {
        this.x = x;
        this.y = y;
        this.isPickedUp = false;
        this.id = "P" + nextId++;
    }

    public boolean isNearBus(Bus bus) {
        int pickupRadius = 30;
        int busWidth = 50;
        int busHeight = 100;
        
        // Calcular centro del bus
        int busCenterX = bus.getX() + busWidth/2;
        int busCenterY = bus.getY() + busHeight/2;
        
        // Calcular distancia
        double distance = Math.sqrt(
            Math.pow(busCenterX - x, 2) + 
            Math.pow(busCenterY - y, 2)
        );
        
        return distance <= pickupRadius;
    }

    // Getters
    public int getX() { return x; }
    public int getY() { return y; }
    public String getId() { return id; }
    public boolean isPickedUp() { return isPickedUp; }
    public void pickUp() { this.isPickedUp = true; }
}