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

    private boolean isOnRoad(int newX, int newY) {
        boolean onHorizontalRoad = (newY % 200 >= 100 && newY % 200 <= 120);
        boolean onVerticalRoad = (newX % 200 >= 100 && newX % 200 <= 120);

        return onHorizontalRoad || onVerticalRoad;
    }

    public void move() {
        int newX = x;
        int newY = y;

        switch (direction) {
            case "UP": newY -= speed; break;
            case "DOWN": newY += speed; break;
            case "LEFT": newX -= speed; break;
            case "RIGHT": newX += speed; break;
        }

        if (isOnRoad(newX, newY)) {
            x = newX;
            y = newY;
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
            move();
            messagingTemplate.convertAndSend("/topic/game", "BUS:" + playerId + "," + x + "," + y);

            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}