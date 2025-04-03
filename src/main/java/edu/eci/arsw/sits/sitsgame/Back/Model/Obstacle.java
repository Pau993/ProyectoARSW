package edu.eci.arsw.sits.sitsgame.Back.Model;

public class Obstacle {
    private int x;
    private int y;
    private int width;
    private int height;
    private String id;
    private static int nextId = 1;
    
    public Obstacle(int x, int y, int width, int height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = "O" + nextId++;
    }

    public boolean collidesWith(Bus bus) {
        int busWidth = 50;  // Ancho del bus
        int busHeight = 100; // Alto del bus
        
        // Verificar si hay intersección entre el obstáculo y el bus
        boolean collision = this.x < (bus.getX() + busWidth) &&
                          (this.x + this.width) > bus.getX() &&
                          this.y < (bus.getY() + busHeight) &&
                          (this.y + this.height) > bus.getY();
                          
        return collision;
    }

    // Getters
    public int getX() { return x; }
    public int getY() { return y; }
    public int getWidth() { return width; }
    public int getHeight() { return height; }
    public String getId() { return id; }
}