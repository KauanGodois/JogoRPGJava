package Jogo.Shop;

import Jogo.Defender;
import Jogo.Enemy;
import Jogo.Potions;
import java.util.Scanner;

public class Upgrades extends Potions{
    
    private int amountUpgrade;
    private int costUpgrade;

    Scanner input = new Scanner(System.in);

    //  EXIBIR MELHORIAS DAS POÇÕES
    public void choiceUpgradePotion(Defender defender, Potions[] potions) {
        System.out.println("1) " + potions[0].getName() + "[" + potions[0].getEffect() + "] >> " + "[" + (potions[0].getEffect() + 3)
                + "Nível da Poção: " + potions[0].getLevel());
        System.out.println("2) " + potions[1].getName() + "[" + potions[1].getEffect() + "] >> " + "[" + (potions[1].getEffect() + 1)
                + "Nível da Poção: " + potions[1].getLevel());
        int choiceUpgrade = input.nextInt();
        switch (choiceUpgrade) {
            case 1:
                potions[0].setEffect(getEffect() + 3);
            case 2:
                potions[1].setEffect(getEffect() + 1);
        }
    }
    
    private int costUpgrade() {
        this.amountUpgrade = 1;
        costUpgrade = amountUpgrade + 4;
        return costUpgrade;
    }
    
    private void tst(Defender defender) {
        defender.setGold(defender.getGold() - costUpgrade());
    }
    
    public void displayUpgradeAttribute(Defender defender) {
        System.out.println(" >> ATRIBUTOS \t\t | >> MELHORIA ");
        System.out.println("1- PONTOS DE VIDA \t | [" + defender.getLifeFixed() + "] >> " + "[" + (defender.getLifeFixed() + 6) + "] ");
        System.out.println("2- ARMADURA \t\t | [" + defender.getArmorFixed() + "] >> " + "[" + (defender.getArmorFixed() + 1) + "]");
        System.out.println("3- DANO \t\t | [" + defender.getDamage() + "] >> " + "[" + (defender.getDamage() + 2) + "]");
        System.out.println("4- CHANCE DE CRÍTICO \t | [" + defender.getCriticalChance() + "%] >> " + "[" + (defender.getCriticalChance() + 1) + "%]");
        System.out.println("5- DANO CRÍTICO \t | [" + defender.getDamageCritical() + "%] >> " + "[" + (defender.getDamageCritical() + 5) + "%]");
        System.out.println("----------------------------------------------");
        System.out.println("Ouro Disponível: " + defender.getGold() + "\t | Custo de Melhoria: " + costUpgrade());
        System.out.println("NÍVEL DO PERSONAGEM: " + this.amountUpgrade);
    }
    
    public void choiceUpgrade(Defender defender, Enemy enemy) { 
        do { 
            displayUpgradeAttribute(defender);
            int choice = input.nextInt();
            switch(choice) {
            case 1:
                defender.setLifeFixed(defender.getLifeFixed() + 6);
                System.out.println("Melhorou Pontos de Vida");
                tst(defender);
                break;
            case 2:
                defender.setArmorFixed(defender.getArmorFixed() + 1);
                System.out.println("Melhorou Armadura");
                tst(defender);
                break;
            case 3:
                defender.setDamage(defender.getDamage() + 2);
                System.out.println("Melhorou Dano");
                tst(defender);
                break;
            case 4:
                defender.setCriticalChance(defender.getCriticalChance() +  5);
                System.out.println("Melhorou Chance de Crítico");
                tst(defender);
                break;
            case 5:
                defender.setDamageCritical(defender.getDamageCritical() + 1);
                System.out.println("Melhorou Dano Crítico");
                tst(defender);
                break;
            }
            this.amountUpgrade++;
        } while (defender.getGold() >= (enemy.getLvl() + 5));  
    }
}
