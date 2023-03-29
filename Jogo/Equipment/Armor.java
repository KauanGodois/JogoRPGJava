package Jogo.Equipment;

// CLASSE AINDA NÃO IMPLEMENTADA //

public class Armor {
    
    private String name;
    private int armor;
    private int life;

    public Armor(String name, int armor, int life) {
        this.name = name;
        this.armor = armor;
        this.life = life;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getArmor() {
        return armor;
    }

    public void setArmor(int armor) {
        this.armor = armor;
    }

    public int getLife() {
        return life;
    }

    public void setLife(int life) {
        this.life = life;
    }
}
