package Jogo.Shop;

import Jogo.Characters.Defender;
import Jogo.Characters.Enemy;
import Jogo.Equipment.Potions;
import Jogo.Game;

public class Menu extends Upgrades{
    
    Upgrades upgrade = new Upgrades();
    Game game = new Game();

    private void displayMenu() {
        System.out.println("\t>> LOJA DO JOGO <<");
        System.out.println("1) --> Melhorar Habilidades");
        System.out.println("2) --> Melhorar Poções");
        System.out.println("3) --> Continuar Jogo");
//        System.out.println("3- ACESSÓRIOS");
    }
    
    public void menu(Defender defender, Enemy enemy) {
        displayMenu();
        int choiceMenu = input.nextInt();
        switch (choiceMenu) {
            case 1:
                upgrade.choiceUpgrade(defender, enemy);
                game.info(defender, enemy);
                break;
            case 2:
//                upgrade.choiceUpgradePotion(defender);
            case 3:
                game.info(defender, enemy);
        }
    }
}
