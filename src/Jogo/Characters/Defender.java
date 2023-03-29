package Jogo.Characters;

public class Defender {

    private String name;

    private int life;
    private int lifeFixed;
    private int manaPoints;
    private int manaPointsFixed;
    private int armor;
    private int armorFixed;
    private int damage;

    // ATRIBUTOS GLOBAIS DO PERSONAGEM
    private int exp;
    private int gold;
    private int lvl;

    // ATRIBUTOS DE PASSIVAS
    private int criticalChance;
    private int damageCritical;

    public Defender(String name, int life, int lifeFixed, int manaPoints, int manaPointsFixed, int armor, int armorFixed) {
        this.name = name;
        this.life = life;
        this.lifeFixed = lifeFixed;
        this.manaPoints = manaPoints;
        this.manaPointsFixed = manaPointsFixed;
        this.armor = armor;
        this.armorFixed = armorFixed;
        this.exp = 0;
        this.gold = 0;
        this.lvl = 1;
        this.damage = 3;
        this.criticalChance = 7;
        this.damageCritical = (this.damage * 2);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public int getManaPoints() {
        return manaPoints;
    }

    public void setManaPoints(int manaPoints) {
        this.manaPoints = manaPoints;
    }

    public int getManaPointsFixed() {
        return manaPointsFixed;
    }

    public void setManaPointsFixed(int manaPointsFixed) {
        this.manaPointsFixed = manaPointsFixed;
    }

    public int getArmor() {
        return armor;
    }

    public void setArmor(int armor) {
        this.armor = armor;
    }

    public int getArmorFixed() {
        return armorFixed;
    }

    public void setArmorFixed(int armorFixed) {
        this.armorFixed = armorFixed;
    }

    public int getExp() {
        return exp;
    }

    public void setExp(int exp) {
        this.exp = exp;
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

    public int getDamage() {
        return damage;
    }

    public void setDamage(int damage) {
        this.damage = damage;
    }

    public int getCriticalChance() {
        return criticalChance;
    }

    public void setCriticalChance(int criticalChance) {
        this.criticalChance = criticalChance;
    }

    public int getDamageCritical() {
        return damageCritical;
    }

    public void setDamageCritical(int damageCritical) {
        this.damageCritical = damageCritical;
    }
}
