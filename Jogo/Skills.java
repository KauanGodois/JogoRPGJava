package Jogo;

import java.util.Random;

public class Skills {

    public boolean chanceCritical(Defender defender, boolean verificar) {
        Random random = new Random();
        int valor = random.nextInt(100 - defender.getCriticalChance());
        if (valor < defender.getCriticalChance()) {
            return true;
        } else {
            return false;
        }
    }

    public void attackDefender1(Defender defender, Enemy enemy, boolean verificar) {
        if (chanceCritical(defender, verificar) == true) {
            enemy.setLife(enemy.getLife() - (defender.getDamage() + defender.getDamageCritical()) - enemy.getArmor());
            System.out.println("Utilizou Ataque Básico");
            System.out.println("Dano Crítico: " + (defender.getDamage() + defender.getDamageCritical() - enemy.getArmor()));
        } else if (chanceCritical(defender, verificar) == false) {
            enemy.setLife(enemy.getLife() - (defender.getDamage() - enemy.getArmor()));
            System.out.println("Utilizou Ataque Básico");
            System.out.println("Dano: " + (defender.getDamage() - enemy.getArmor()));
        }
    }

    public void attackdefender2(Defender defender, Enemy enemy, boolean verificar) {
        if (chanceCritical(defender, verificar) == true) {
            enemy.setLife(enemy.getLife() - ((defender.getDamage() + defender.getDamageCritical() + 3) - enemy.getArmor()));
            System.out.println("Utilizou Ataque Forte");
            System.out.println("Dano Crítico: " + ((defender.getDamage() + defender.getDamageCritical() + 3) - enemy.getArmor()));
        } else if (chanceCritical(defender, verificar) == false) {
            enemy.setLife(enemy.getLife() - ((defender.getDamage() + 3) - enemy.getArmor()));
            System.out.println("Utilizou Ataque Forte");
            System.out.println("Dano: " + ((defender.getDamage() + 3) - enemy.getArmor())); 
        }
    }

    public void attackEnemy1(Defender defender, Enemy enemy) {
        defender.setLife(defender.getLife() - (enemy.getDamage() - defender.getArmor()));
        System.out.println("Ataque Inimigo: Básico");
        System.out.println("Dano: " + (enemy.getDamage() - defender.getArmor()));
    }

    public void attackEnemy2(Defender defender, Enemy enemy) {
        defender.setLife(defender.getLife() - ((enemy.getDamage() + 2) - defender.getArmor()));
        System.out.println("Ataque Inimigo: Forte");
        System.out.println("Dano: " + ((enemy.getDamage() + 2) - defender.getArmor()));
    }
}
