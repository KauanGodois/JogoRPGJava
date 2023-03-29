package Jogo.Shop;

import Jogo.Defender;
import java.util.Scanner;

public class Potions {

    private int tier;

    private int potionLife = 6;
    private int potionArmor = 1;

    private int amountPotionLife = 1;
    private int amountPotionArmor = 1;

    private int potionLifeLvl = 1;
    private int potionArmorLvl = 1;

    Scanner input = new Scanner(System.in);

    public void displayPotions(Defender defender) {
        System.out.println("-----------------------------------------------");
        System.out.println("\t>> POÇÕES <<");
        System.out.println("1) Poção de VIDA [" + defender.getLife() + "] >> " + "[" + (defender.getLifeFixed() * this.potionLife) + "]"
                + "\t | Possui [" + this.amountPotionLife + "] NÍVEL: " + this.potionLifeLvl);
        System.out.println("2) Poção de VIDA [" + defender.getArmor() + "] >> [" + this.potionArmor + "]"
                + "\t | Possui [" + this.amountPotionArmor + "] NÍVEL: " + this.potionArmorLvl);
        System.out.println("3) >>MELHORAR POÇÕES<<");
    }

    public void displayUpgradePotion(Defender defender) {
        System.out.println("1) Poção de VIDA [" + this.potionLife + "] >> " + "[" + (this.potionArmor + 3)
                + "NÍVEL: " + this.potionLifeLvl);
        System.out.println("2) Poção de ARMADURA [" + this.potionArmor + "] >> " + "[" + (this.potionArmor + 1)
                + "NÍVEL: " + this.potionArmorLvl);
        int choiceUpgrade = input.nextInt();
        switch (choiceUpgrade) {
            case 1:
                setPotionLife(getPotionLife() + 3);
            case 2:
                setPotionArmor(getPotionArmor() + 1);
        }

    }

    public void choicePotion(Defender defender) {
        int choice = input.nextInt();
        switch (choice) {
            case 1:
                defender.setLife(defender.getLife() + (defender.getLifeFixed() * 25 / 100));
                System.out.println("Usou Poção de [VIDA]" + " | RESTAM [" + this.potionLife + "]");
                this.potionLife--;
                break;
            case 2:
                try {
                    if (defender.getArmor() > 0) {
                        defender.setArmor(defender.getArmor() + (defender.getArmor() * 120 / 100));
                        System.out.println("Usou Poção de [ARMADURA]" + " | RESTAM [" + this.potionArmor + "]");
                        this.potionArmor--;
                        break;
                    }
                } catch (Exception e) {
                    System.out.println("Não é possível usar Poção de ARMADURA com 0 pontos!");

                }
            case 3:
                displayUpgradePotion(defender);
        }
    }
    
    public void displayMain(Defender defender) {
        displayPotions(defender);
        choicePotion(defender);
    }


public int getTier() {
        return tier;
    }

    public void setTier(int tier) {
        this.tier = tier;
    }

    public int getPotionLife() {
        return potionLife;
    }

    public void setPotionLife(int potionLife) {
        this.potionLife = potionLife;
    }

    public int getPotionArmor() {
        return potionArmor;
    }

    public void setPotionArmor(int potionArmor) {
        this.potionArmor = potionArmor;
    }

    public int getAmountPotionLife() {
        return amountPotionLife;
    }

    public void setAmountPotionLife(int amountPotionLife) {
        this.amountPotionLife = amountPotionLife;
    }

    public int getAmountPotionArmor() {
        return amountPotionArmor;
    }

    public void setAmountPotionArmor(int amountPotionArmor) {
        this.amountPotionArmor = amountPotionArmor;
    }

    public int getPotionLifeLvl() {
        return potionLifeLvl;
    }

    public void setPotionLifeLvl(int potionLifeLvl) {
        this.potionLifeLvl = potionLifeLvl;
    }

    public int getPotionArmorLvl() {
        return potionArmorLvl;
    }

    public void setPotionArmorLvl(int potionArmorLvl) {
        this.potionArmorLvl = potionArmorLvl;
    }
}
