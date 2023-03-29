package Jogo;

import Jogo.Equipment.Potions;
import Jogo.Characters.Enemy;
import Jogo.Characters.Defender;
import Jogo.Shop.Menu;
import java.util.Random;
import java.util.Scanner;

public class Game extends Skills {

    public int enemyRandomAttack() {
        Random random = new Random();
        return random.nextInt(2) + 1;
    }
    
    public void displayEnemyAttack(Defender defender, Enemy enemy) {
        switch (enemyRandomAttack()) {
            case 1:
                attackEnemy1(defender, enemy);
                break;
            case 2:
                attackEnemy2(defender, enemy);
                break;
        }
    }

    public int choiceDefenderSkills() {
        Scanner input = new Scanner(System.in);
        System.out.println("1) Ataque Básico");
        System.out.println("2) Ataque Forte");
        System.out.println("3) Usar Poções");
        int resposta = input.nextInt();
        return resposta;
    }

    public void info(Defender defender, Enemy enemy) {
        System.out.println("\n- DEFENDER - " + " \t| - ENEMY -");
        System.out.println("Vida: " + defender.getLifeFixed() + "/" + defender.getLife()
                + " \t| Vida: " + enemy.getLifeFixed() + "/" + enemy.getLife());
        System.out.println("Armadura: " + defender.getArmor() + " \t| Armadura: " + enemy.getArmor());
        System.out.println("Dano: " + defender.getDamage() + " \t| Dano: " + enemy.getDamage());
        System.out.println("Ouro: " + defender.getGold() + " \t| Ouro Ganho: " + enemy.getGold());
        System.out.println("------------------------------------");
    }

    public void nextLevel(Defender defender, Enemy enemy) {
        Menu menu = new Menu();
        System.out.println("NEXT LEVEL " + enemy.getLvl() + " >> " + (enemy.getLvl() + 1));
        enemy.setLifeFixed(enemy.getLifeFixed() + (enemy.getLifeFixed() * 25 / 100));
        enemy.setLife(enemy.getLifeFixed());
        enemy.setDamage(enemy.getDamage() + 1);
        enemy.setLvl(enemy.getLvl() + 1);
        defender.setGold(defender.getGold() + enemy.getGold());
        menu.menu(defender, enemy);
    }

    public void battle() {
        
        Scanner input = new Scanner(System.in);
        // PERSONAGEM 
        Defender defender = new Defender("Defensor", 25, 25, 20, 20, 0, 0);
        
        // INIMIGO
        Enemy enemy = new Enemy("Ressurgido", 5, 5, 0, 1, 1, 6);
        
        // POÇÕES
        Potions p = new Potions();
        Potions[] potions = {new Potions("Poção de Cura", 5, 3, 1), new Potions("Poção de Armadura", 1, 3, 1)
                , new Potions("Poção de Mana", 15, 2, 1)};

        // ARMADURAS
        
        info(defender, enemy);
        System.out.println("\t>> Escolha seu Ataque << ");

        while (defender.getLife() > 0 && enemy.getLife() > 0) {

            switch (choiceDefenderSkills()) {
                case 1:
                    attackDefender1(defender, enemy, false);
                    displayEnemyAttack(defender, enemy);
                    break;
                case 2:
                    if(defender.getManaPoints() > 20) {
                        attackdefender2(defender, enemy, false);
                        displayEnemyAttack(defender, enemy);
                        defender.setManaPoints(defender.getManaPoints() - 20);
                        break;
                    } else
                        System.out.println("Mana Insulficiente!");
                        break;
                case 3:
                    p.displayPotions(defender, potions);
                    p.choicePotions(defender, potions, input.nextInt());
                default:
                    System.out.println("Comando Inválido!");
            }

            info(defender, enemy);

            if (enemy.getLife() <= 0) {
                nextLevel(defender, enemy);
            }  
        }
    }
}
