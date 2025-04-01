package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

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

    private final Lock lock = new ReentrantLock();
    private final Condition moveCondition = lock.newCondition();
    private boolean canMove = false; // Indica si el bus puede moverse

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

    public void allowMove() {
        lock.lock();
        try {
            System.out.println("allowMove() llamado para el bus con playerId: " + playerId);
            canMove = true;
            moveCondition.signal(); // Despertar al hilo para que se mueva
        } finally {
            lock.unlock();
        }
    }

    @Override
    public void run() {
        while (running) {
            lock.lock();
            try {
                while (!canMove) {
                    System.out.println("Esperando permiso para moverse...");
                    moveCondition.await(); // Esperar hasta que se permita el movimiento
                }
                System.out.println("Permiso recibido. Moviendo el bus.");
                canMove = false; // Resetear el estado para esperar el próximo botón
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } finally {
                lock.unlock();
            }

            move(); // Mueve el bus automáticamente
            System.out.println("Bus movido a posición: " + x + ", " + y);

            // Enviar la posición y la orientación a todas las pestañas
            messagingTemplate.convertAndSend("/topic/game", "BUS:" + playerId + "," + x + "," + y + "," + angle);

            try {
                Thread.sleep(100); // Movimiento cada 100ms
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}