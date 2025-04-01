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
    private double angle = 0; // Ángulo de orientación del bus

    public Bus(String playerId, int startX, int startY, SimpMessagingTemplate messagingTemplate) {
        this.playerId = playerId;
        this.x = startX;
        this.y = startY;
        this.messagingTemplate = messagingTemplate;
        updateAngle(); // Establecer el ángulo inicial según la dirección
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

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
        updateAngle(); // Actualizar el ángulo cuando cambia la dirección
    }

    private void updateAngle() {
        // Ajustar el ángulo según la dirección
        switch (direction) {
            case "UP": angle = -90; break;
            case "DOWN": angle = -90; break;
            case "LEFT": angle = 0; break;
            case "RIGHT": angle = 0; break;
        }
    }

    public double getAngle() {
        return angle;
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

            // 🔄 Enviar la posición y la orientación a todas las pestañas
            messagingTemplate.convertAndSend("/topic/game", "BUS:" + playerId + "," + x + "," + y + "," + angle);

            try {
                Thread.sleep(100); // 🚀 Movimiento cada 100ms
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
