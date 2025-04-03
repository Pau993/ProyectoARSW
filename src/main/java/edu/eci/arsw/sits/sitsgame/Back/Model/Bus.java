package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.util.List;
import java.util.Random;
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

    // Verificar colisión
    for (Bus other : allBuses) {
        if (other != null && other.running && !this.plate.equals(other.plate)) {
            if (this.collidesWith(other)) {
                System.out.println("¡Colisión detectada entre " + this.plate + " y " + other.plate + "!");

                // **Evitar doble eliminación asegurando que solo un bus maneje la colisión**
                if (this.plate.compareTo(other.plate) > 0) {
                    System.out.println("Bus " + this.plate + " decide el resultado de la colisión.");

                    // Determinar aleatoriamente quién sobrevive
                    Bus busToRemove = new Random().nextBoolean() ? this : other;
                    Bus survivor = (busToRemove == this) ? other : this;

                    // Eliminar el bus perdedor
                    busToRemove.stop();
                    GameManager.removeBus(busToRemove.plate);
                    messagingTemplate.convertAndSend("/topic/collision", "COLLISION:" + busToRemove.plate);

                    System.out.println("Bus eliminado: " + busToRemove.plate);

                    // Asegurar que el bus sobreviviente puede seguir moviéndose
                    survivor.lock.lock();
                    try {
                        survivor.running = true;
                        survivor.canMove = true;
                        survivor.moveCondition.signal();
                    } finally {
                        survivor.lock.unlock();
                    }

                    return; // Salir de la función, evitando cualquier otro cambio
                } else {
                    return; // No hacer nada si el otro bus ya maneja la colisión
                }
            }
        }
    }

    // Si no hay colisión, actualizar la posición
    this.x = newX;
    this.y = newY;
}

    public boolean collidesWith(Bus other) {
        // Verificar que el otro bus no sea null y esté activo
        if (other == null || !other.running) {
            return false;
        }

        // Verificar que no sea el mismo bus
        if (this.plate.equals(other.plate)) {
            return false;
        }

        int busWidth = 50;
        int busHeight = 100;

        // Calcular las coordenadas de los bordes de ambos buses
        int thisRight = this.x + busWidth;
        int thisBottom = this.y + busHeight;
        int otherRight = other.x + busWidth;
        int otherBottom = other.y + busHeight;

        // Verificar si hay intersección entre los rectángulos
        boolean collision = this.x < otherRight &&
                thisRight > other.x &&
                this.y < otherBottom &&
                thisBottom > other.y;

        if (collision) {
            System.out.println("Colisión real detectada entre bus " + this.plate + " y bus " + other.plate);
        }

        return collision;
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
    //esto funciona en teoria
}