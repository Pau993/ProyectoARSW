package edu.eci.arsw.sits.sitsgame.Back.Model;

import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import org.springframework.messaging.simp.SimpMessagingTemplate;

public class Bus implements Runnable, KeyListener {

    private String playerId;
    private int x;
    private int y;
    private final int speed = 10;
    private String direction = "RIGHT";
    private boolean running = true;
    private final SimpMessagingTemplate messagingTemplate;
    private boolean ableDirectionChange;

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
        boolean onHorizontalRoad = (newY % 100 >= 70 && newY % 100 <= 150);
        boolean onVerticalRoad = (newX % 100 >= 80 && newX % 100 <= 150);

        boolean result = onHorizontalRoad || onVerticalRoad;

        System.out.println("Bus en (" + newX + ", " + newY + ") - "
                + "Horizontal: " + onHorizontalRoad + ", Vertical: " + onVerticalRoad
                + " → Puede moverse: " + result);

        return result;
    }

    public void move() {
        int newX = x;
        int newY = y;

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

        if (isOnRoad(newX, newY)) {
            x = newX;
            y = newY;
        }

        System.out.println("Bus " + playerId + " está en posición: " + x + ", " + y);
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
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    // Métodos de KeyListener
    @Override
    public void keyPressed(KeyEvent e) {
        if (!isAbleDirectionChange()) {
            return;
        }

        int key = e.getKeyCode();
        System.out.println("Tecla presionada: " + KeyEvent.getKeyText(e.getKeyCode()));

        // Usar .equals() para comparar cadenas
        if ((key == KeyEvent.VK_UP || key == KeyEvent.VK_W) && !direction.equals("DOWN")) {
            direction = "UP";
        } else if ((key == KeyEvent.VK_DOWN || key == KeyEvent.VK_S) && !direction.equals("UP")) {
            direction = "DOWN";
        } else if ((key == KeyEvent.VK_LEFT || key == KeyEvent.VK_A) && !direction.equals("RIGHT")) {
            direction = "LEFT";
        } else if ((key == KeyEvent.VK_RIGHT || key == KeyEvent.VK_D) && !direction.equals("LEFT")) {
            direction = "RIGHT";
        } else if (key == KeyEvent.VK_SPACE) {
            ableDirectionChange = !ableDirectionChange;
        }

        move();
        System.out.println("Dirección actual: " + direction);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        // Detener el movimiento continuo si es necesario
        System.out.println("Tecla liberada: " + KeyEvent.getKeyText(e.getKeyCode()));
    }

    @Override
    public void keyTyped(KeyEvent e) {
        // Capturar caracteres específicos si es necesario
        System.out.println("Tecla tipeada: " + e.getKeyChar());
    }

    public boolean isAbleDirectionChange() {
        return ableDirectionChange;
    }
}
