import type { Enemy } from './enemy'
import { type Hero, type PotionId, totalArmor } from './hero'
import { type Rng, defaultRng } from './rng'

export const STRONG_ATTACK_COST = 20
export const ENEMY_STRONG_CHANCE = 0.5
export const ENEMY_STRONG_BONUS = 2

export type HeroAction = 'basic' | 'strong'

export interface Hit {
  damage: number
  crit: boolean
  strong: boolean
}

export function canUseStrong(hero: Hero): boolean {
  return hero.mana >= STRONG_ATTACK_COST
}

/** Dano bruto antes da armadura. O Ataque Forte vale 150% do dano +3. */
export function heroRawDamage(hero: Hero, action: HeroAction): number {
  return action === 'strong' ? Math.round(hero.damage * 1.5) + 3 : hero.damage
}

export function heroAttack(hero: Hero, enemy: Enemy, action: HeroAction, rng: Rng = defaultRng): Hit {
  const strong = action === 'strong'
  if (strong) {
    if (!canUseStrong(hero)) throw new Error('Mana insuficiente')
    hero.mana -= STRONG_ATTACK_COST
  }
  const crit = rng() * 100 < hero.critChance
  const raw = heroRawDamage(hero, action) + (crit ? hero.critBonus : 0)
  // Sempre pelo menos 1: no Java a armadura alta fazia o golpe curar o alvo
  const damage = Math.max(1, raw - enemy.armor)
  enemy.life = Math.max(0, enemy.life - damage)
  return { damage, crit, strong }
}

/** O inimigo escolhe entre ataque básico e forte (+2) com 50% de chance, como no displayEnemyAttack(). */
export function enemyAttack(hero: Hero, enemy: Enemy, rng: Rng = defaultRng): Hit {
  const strong = rng() < ENEMY_STRONG_CHANCE
  const raw = enemy.damage + (strong ? ENEMY_STRONG_BONUS : 0)
  const damage = Math.max(1, raw - totalArmor(hero))
  hero.life = Math.max(0, hero.life - damage)
  return { damage, crit: false, strong }
}

export function endHeroTurn(hero: Hero): void {
  hero.mana = Math.min(hero.maxMana, hero.mana + hero.manaRegen)
}

export type PotionResult = 'ok' | 'empty' | 'full'

/** Usar poção não gasta o turno (igual ao jogo original, onde o inimigo não atacava). */
export function usePotion(hero: Hero, id: PotionId): PotionResult {
  const potion = hero.potions[id]
  if (potion.amount <= 0) return 'empty'

  switch (id) {
    case 'heal':
      if (hero.life >= hero.maxLife) return 'full'
      hero.life = Math.min(hero.maxLife, hero.life + potion.effect)
      break
    case 'mana':
      if (hero.mana >= hero.maxMana) return 'full'
      hero.mana = Math.min(hero.maxMana, hero.mana + potion.effect)
      break
    case 'armor':
      hero.bonusArmor += potion.effect
      break
  }
  potion.amount--
  return 'ok'
}
