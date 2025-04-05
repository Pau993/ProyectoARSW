package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.List;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.messaging.simp.SimpMessagingTemplate;

public class Bus implements Runnable {
    private final String playerId;
    private final String plate;
    private int x;
    private int y;
    private final int speed = 16;
    private String direction = "RIGHT";
    private boolean running = true;
    private final SimpMessagingTemplate messagingTemplate;
    private double angle = 0;
    private int passengersCollected = 0;

    private final Lock lock = new ReentrantLock();
    private final Condition moveCondition = lock.newCondition();
    private boolean canMove = false;

    public Bus(String playerId, String plate, int startX, int startY, SimpMessagingTemplate messagingTemplate) {
        this.playerId = playerId;
        this.plate = plate;
        this.x = startX;
        this.y = startY;
        this.messagingTemplate = messagingTemplate;
        updateAngle();

        GameManager.addBus(plate, this, Thread.currentThread());
    }

    public String getPlayerId() {
        return playerId;
    }

    public String getPlate() {
        return plate;
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
        updateAngle();
    }

    private void updateAngle() {
        switch (direction) {
            case "UP":
            case "DOWN":
                angle = -90;
                break;
            case "LEFT":
            case "RIGHT":
                angle = 0;
                break;
        }
    }

    public double getAngle() {
        return angle;
    }

    public String getPosition() {
        return x + "," + y;
    }

    public void stop() {
        lock.lock();
        try {
            running = false;
            canMove = false;
        } finally {
            lock.unlock();
        }
    }

    public void allowMove() {
        lock.lock();
        try {
            canMove = true;
            moveCondition.signal();
        } finally {
            lock.unlock();
        }
    }

    public void passengerCollected() {
        passengersCollected++;
        messagingTemplate.convertAndSend("/topic/score", "SCORE:" + this.plate + "," + passengersCollected);
    }

    public void move() {
        switch (direction) {
            case "UP":
                y -= speed;
                break;
            case "DOWN":
                y += speed;
                break;
            case "LEFT":
                x -= speed;
                break;
            case "RIGHT":
                x += speed;
                break;
        }
    }

    @Override
    public void run() {
        while (running) {
            lock.lock();
            try {
                while (!canMove) {
                    moveCondition.await();
                }
                canMove = false;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } finally {
                lock.unlock();
            }

            move();

            messagingTemplate.convertAndSend(
                    "/topic/game",
                    "BUS:" + playerId + "," + x + "," + y + "," + angle
            );

            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
