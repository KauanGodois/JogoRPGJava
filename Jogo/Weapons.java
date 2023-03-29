package Jogo;

public class Weapons {

    private String name;
    private String type;
    private double damage;
    private  double speedAtk;
    private int criticalChance;
    private int damageCritical;

    public Weapons(String name, String type, double damage, double speedAtk, int criticalChance, int damageCritical) {
        this.name = name;
        this.type = type;
        this.damage = damage;
        this.speedAtk = speedAtk;
        this.criticalChance = criticalChance;
        this.damageCritical = damageCritical;
    }

    public void displayWeapons() {
        System.out.println("\tTIPO DE ARMA: " + this.type);
        System.out.println("\tArma: " + this.name);
        System.out.println("\tDano: " + this.damage);
        System.out.println("\tVelocidade de Ataque: " + this.speedAtk);
        System.out.println("\tChance de crítico: " + this.criticalChance);
        System.out.println("\tDano crítico: " + this.damageCritical);
    }
    
    // ARMAS
//        Weapons espadaGrande = new Weapons("Espada Reta", "ESPADA", 12, 1.2, 9, 55);
//        Weapons espadaLonga = new Weapons("Espada Longa", "ESPADA", 9, 1.5, 6, 35);
//        Weapons arcoComposto = new Weapons("Arco Composto", "ARCO", 12, 1.2, 3, 60);
//        Weapons arcoLongo = new Weapons("Arco Longo", "ARCO", 13, 1.1, 6, 55);
//        Weapons cajadoAmaldicoado = new Weapons("Cajado Amaldiçoado", "CAJADO", 6, 1.9, 8, 30);
//        Weapons cajadoNatureza = new Weapons("Cajado da Natureza", "CAJADO", 4, 2.1, 4, 15);
//        Weapons marteloGuerra = new Weapons("Martelo de Guerra", "MARTELO", 16, 0.8, 10, 55);
//        Weapons marteloMarreta = new Weapons("Martelo Marreta", "MARTELO", 19, 0.6, 11, 40);
//        Weapons bestaAco = new Weapons("Besta de Aço", "BESTA", 9, 1.4, 7, 30);
//        Weapons bestaComposta = new Weapons("Besta Composta", "BESTA", 5, 2.7, 2, 25);

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getDamage() {
        return damage;
    }

    public void setDamage(double damage) {
        this.damage = damage;
    }

    public double getSpeedAtk() {
        return speedAtk;
    }

    public void setSpeedAtk(double speedAtk) {
        this.speedAtk = speedAtk;
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
