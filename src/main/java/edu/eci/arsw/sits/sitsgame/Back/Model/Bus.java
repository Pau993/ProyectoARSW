package edu.eci.arsw.sits.sitsgame.Back.Model;

import org.springframework.messaging.simp.SimpMessagingTemplate;

public class Bus implements Runnable {
    private String playerId;
    private int x;
    private int y;
    private final int speed = 10;
    private String direction = "RIGHT";
    private boolean running = true;
    private final SimpMessagingTemplate messagingTemplate;

    public Bus(String playerId, int startX, int startY, SimpMessagingTemplate messagingTemplate) {
        this.playerId = playerId;
        this.x = startX;
        this.y = startY;
        this.messagingTemplate = messagingTemplate;
    }

    public String getPlayerId() {
        return playerId;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public void move() {
        switch (direction) {
            case "UP": y -= speed; break;
            case "DOWN": y += speed; break;
            case "LEFT": x -= speed; break;
            case "RIGHT": x += speed; break;
        }
    }

    public String getPosition() {
        return x + "," + y;
    }

    public void stop() {
        running = false;
    }

    @Override
    public void run() {
        while (running) {
            move(); // Mueve el bus automáticamente

            // 🔄 Enviar la posición actual a todas las pestañas
            messagingTemplate.convertAndSend("/topic/game", "BUS:" + playerId + "," + x + "," + y);

            try {
                Thread.sleep(100); // 🚀 Movimiento cada 100ms
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}