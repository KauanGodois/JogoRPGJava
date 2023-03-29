package Jogo;

import Jogo.Defender;

public class Potions {

//    private int tier; 
    private String name;
    private int effect;
    private int amount;
    private int level;

    //CONSTRUTOR 
    public Potions() {
    }

    public Potions(String name, int effect, int amount, int level) {
        this.name = name;
        this.effect = effect;
        this.amount = amount;
        this.level = level;
    }

    // EXIBIR POÇÕES
    public void displayPotions(Defender defender, Potions[] potions) {
        System.out.println("------------------------------");
        System.out.println("\t>> Poções <<");
        System.out.println("1) " + potions[0].getName() + " [" + defender.getLife() + "] >> "
                + "[" + (defender.getLife() + potions[0].getEffect()) + "]"
                + "\nPossui [" + potions[0].getAmount() + "] | Nível da Poção: " + potions[0].getLevel());
        System.out.println("------------------------------");
        System.out.println("2) " + potions[1].getName() + " [" + defender.getArmor() + "] >> "
                + "[" + (defender.getArmor() + potions[1].getEffect()) + "]"
                + "\nPossui [" + potions[1].getAmount() + "] | Nível da Poção: " + potions[1].getLevel());
        System.out.println("------------------------------");
        System.out.println("3) " + potions[2].getName() + " [" + defender.getManaPoints() + "] >> "
                + "[" + (defender.getManaPoints() + potions[2].getEffect()) + "]"
                + "\nPossui [" + potions[2].getAmount() + "] | Nível da Poção: " + potions[2].getLevel());
        System.out.print("Escolha uma poção: ");
    }

    public void choicePotions(Defender defender, Potions[] potions, int choice) {
        switch (choice) {
            case 1:
                if (potions[0].getAmount() > 0) {
                    if((defender.getLife() + potions[0].getEffect()) > defender.getLifeFixed()) {
                        defender.setLife(defender.getLifeFixed());
                         System.out.println("Utilizou " + potions[0].getName() + " | A poção não teve sua Máxima Eficácia!");
                    } else {
                        defender.setLife(defender.getLife() + potions[0].getEffect());
                        potions[0].amount--;
                        System.out.println("Utilizou " + potions[0].getName());
                    }
                } else
                    System.out.println("Poções Insulficiente!");
                    break;
            case 2:
                if (potions[1].getAmount() > 0) {
                    defender.setLife(defender.getLife() + potions[0].getEffect());
                    potions[1].amount--;
                    System.out.println("Utilizou " + potions[1].getName());
                } else
                    System.out.println("Poções Insulficiente!");
                break;
            case 3:
                if (potions[2].getAmount() > 0) {
                    defender.setLife(defender.getLife() + potions[2].getEffect());
                    potions[2].amount--;
                    System.out.println("Utilizou " + potions[2].getName());
                } else
                    System.out.println("Poções Insulficiente!");
                break;
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getEffect() {
        return effect;
    }

    public void setEffect(int effect) {
        this.effect = effect;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
