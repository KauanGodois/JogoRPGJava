import type { MetaLevels } from './meta'

export type PotionId = 'heal' | 'armor' | 'mana'

export interface Potion {
  id: PotionId
  name: string
  effect: number
  amount: number
}

export interface Hero {
  maxLife: number
  life: number
  maxMana: number
  mana: number
  manaRegen: number
  armor: number
  /** Armadura temporária da Poção de Armadura; zera ao fim de cada luta. */
  bonusArmor: number
  damage: number
  /** Em porcentagem (0-100). */
  critChance: number
  /** Dano extra somado quando o golpe é crítico. */
  critBonus: number
  potions: Record<PotionId, Potion>
}

/** Fração da vida máxima recuperada entre uma luta e outra. */
export const RECOVERY_BETWEEN_FIGHTS = 0.35

/** Valores base vindos do Defender.java: vida 25, mana 20, dano 3, crítico 7%, dano crítico = dano x2. */
export function createHero(meta: MetaLevels): Hero {
  const maxLife = 25 + meta.life * 5
  const damage = 3 + meta.damage
  return {
    maxLife,
    life: maxLife,
    maxMana: 20,
    mana: 20,
    manaRegen: 4,
    armor: meta.armor,
    bonusArmor: 0,
    damage,
    critChance: 7 + meta.crit * 2,
    critBonus: damage * 2,
    potions: {
      heal: { id: 'heal', name: 'Poção de Cura', effect: 5, amount: 3 + meta.potions },
      armor: { id: 'armor', name: 'Poção de Armadura', effect: 1, amount: 3 },
      mana: { id: 'mana', name: 'Poção de Mana', effect: 15, amount: 2 },
    },
  }
}

export function totalArmor(hero: Hero): number {
  return hero.armor + hero.bonusArmor
}

export function recoverBetweenFights(hero: Hero): void {
  hero.life = Math.min(hero.maxLife, hero.life + Math.ceil(hero.maxLife * RECOVERY_BETWEEN_FIGHTS))
  hero.mana = hero.maxMana
  hero.bonusArmor = 0
}
