package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.List;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.messaging.simp.SimpMessagingTemplate;

public class Bus implements Runnable {
    private String playerId;
    private String plate;
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

    public Bus(String playerId, String plate, int startX, int startY, SimpMessagingTemplate messagingTemplate) {
        this.playerId = playerId;
        this.plate = plate;
        this.x = startX;
        this.y = startY;
        this.messagingTemplate = messagingTemplate;
        updateAngle(); // Establecer el ángulo inicial según la dirección

        System.out.println("Bus creado con ID: " + playerId + ", Placa: " + plate + ", Posición inicial: (" + x + ", " + y + ")");
        GameManager.addBus(plate, this, Thread.currentThread());
        System.out.println("Bus añadido a GameManager: " + playerId);
        System.out.println("Buses actuales en el juego: " + GameManager.getAllBuses().size());

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
        updateAngle(); // Actualizar el ángulo cuando cambia la dirección
    }

    private void updateAngle() {
        // Ajustar el ángulo según la dirección
        switch (direction) {
            case "UP":
                angle = -90;
                break;
            case "DOWN":
                angle = -90;
                break;
            case "LEFT":
                angle = 0;
                break;
            case "RIGHT":
                angle = 0;
                break;
        }
    }

    public double getAngle() {
        return angle;
    }

    public void move(List<Bus> allBuses) {
        int newX = x, newY = y;

        switch (direction) {
            case "UP":
                newY -= speed;
                break;
            case "DOWN":
                newY += speed;
                break;
            case "LEFT":
                newX -= speed;
                break;
            case "RIGHT":
                newX += speed;
                break;
        }

        // Verificar si la nueva posición genera una colisión con otro bus
        for (Bus other : allBuses) {
            if (!other.equals(this) && this.collidesWith(other)) {
                System.out.println("¡Colisión detectada entre " + this.plate + " y " + other.plate + "!");
                running = false; // Detener el bus que choca
                return;
            }
        }

        // Si no hay colisión, actualizar la posición
        this.x = newX;
        this.y = newY;
    }

    public boolean collidesWith(Bus other) {
        int busWidth = 50; // Ajusta según el tamaño real de los buses
        int busHeight = 100;

        return this.x < other.x + busWidth &&
                this.x + busWidth > other.x &&
                this.y < other.y + busHeight &&
                this.y + busHeight > other.y;
    }

    @SuppressWarnings("unused")
    private void handleCollision(Bus other) {
        System.out.println("Bus " + this.plate + " colisionó con " + other.plate);
        this.running = false; // El bus muere
        messagingTemplate.convertAndSend("/topic/collision", "COLLISION:" + this.plate + "," + other.plate);
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

            List<Bus> allBuses = GameManager.getAllBuses(); // Obtener la lista de buses
            if (allBuses != null) {
                move(allBuses);
            }

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