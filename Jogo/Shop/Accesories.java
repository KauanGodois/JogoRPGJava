package Jogo.Shop;

import Jogo.Defender;
import java.util.Scanner;

public class Accesories extends Defender {

    Scanner input = new Scanner(System.in);
    
    public Accesories(String name, int life, int lifeFixed, int manaPoints, int manaPointsFixed, int armor, int armorFixed) {
        super(name, life, lifeFixed, manaPoints, manaPointsFixed, armor, armorFixed);
    }

    public void displayShop(Defender defender) {
        System.out.println("\n\t>> SHOP <<");
        System.out.println("1- Buy LIFE [" + defender.getLife() + "] >> " + "[" + (defender.getLife() + (defender.getLifeFixed() * 25 / 100)) + "]");
        System.out.println("2- Buy ARMOR [" + defender.getArmor() + "] >> " + "[" + (defender.getArmor() * 120 / 100) + "]");
        System.out.println("-----------------------------------------------");
    }

    public void choiceShop(Defender defender) {
        int choice = input.nextInt();
        switch (choice) {
            case 1:
                defender.setLife(defender.getLife() + (defender.getLifeFixed() * 25 / 100));
                System.out.println("Regenerou [VIDA]");
                break;
            case 2:
                try {
                    if (defender.getArmor() > 0) {
                        defender.setArmor(defender.getArmor() + (defender.getArmor() * 120 / 100));
                        System.out.println("Regenerou [ARMADURA]");
                        break;
                    }
                } catch (Exception e) {
                    System.out.println("Não é possível regenerar ARMADURA com 0 pontos!");
                }

        }
    }

}
