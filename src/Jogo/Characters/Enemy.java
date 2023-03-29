package Jogo.Characters;

public class Enemy {
    
    private String classe;
    private int life;
    private int lifeFixed;
    private int armor;
    private int damage;
    private int lvl;
    private int gold;
    
    public Enemy(){
    }

    public Enemy(String classe, int life, int lifeFixed, int armor, int damage, int lvl, int gold) {
        this.classe = classe;
        this.life = life;
        this.lifeFixed = lifeFixed;
        this.armor = armor;
        this.damage = damage;
        this.lvl = lvl;
        this.gold = gold;
    }

    public String getClasse() {
        return classe;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }
    
    public int getLife() {
        return life;
    }

    public void setLife(int life) {
        this.life = life;
    }

    public int getLifeFixed() {
        return lifeFixed;
    }

    public void setLifeFixed(int lifeFixed) {
        this.lifeFixed = lifeFixed;
    }

    public int getArmor() {
        return armor;
    }

    public void setArmor(int armor) {
        this.armor = armor;
    }

    public int getDamage() {
        return damage;
    }

    public void setDamage(int damage) {
        this.damage = damage;
    }

    public int getLvl() {
        return lvl;
    }

    public void setLvl(int lvl) {
        this.lvl = lvl;
    }

    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = gold;
    }
}
