package Jogo;

public class SkillsWeapons extends Weapons {

    public SkillsWeapons(String name, String type, double damage, double speedAtk, int criticalChance, int damageCritical) {
        super(name, type, damage, speedAtk, criticalChance, damageCritical);
    }

    public void espadaGrande(Defender defender, Weapons espadaGrande) {
        defender.setDamage(defender.getDamage() + (espadaGrande.getDamage() * espadaGrande.getSpeedAtk()));
        System.out.println(defender.getDamage());
    }
}
