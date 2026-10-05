import type { Hero } from './hero'
import { type Rng, defaultRng, pickWeighted } from './rng'

export type Rarity = 'common' | 'rare' | 'epic'

export const RARITY_LABEL: Record<Rarity, string> = { common: 'Comum', rare: 'Raro', epic: 'Épico' }

export interface UpgradeDef {
  id: string
  title: string
  description: (hero: Hero) => string
  rarity: Rarity
  weight: number
  apply: (hero: Hero) => void
  available?: (hero: Hero) => boolean
}

export const MAX_CRIT_CHANCE = 60

/** Baseado nos atributos do Upgrades.java (vida +6, armadura +1, dano +2, crítico...). */
export const UPGRADES: readonly UpgradeDef[] = [
  {
    id: 'life',
    title: 'Pontos de Vida',
    description: (h) => `Vida máxima ${h.maxLife} → ${h.maxLife + 6}`,
    rarity: 'common',
    weight: 10,
    apply: (h) => {
      h.maxLife += 6
      h.life += 6
    },
  },
  {
    id: 'armor',
    title: 'Armadura',
    description: (h) => `Armadura ${h.armor} → ${h.armor + 1}`,
    rarity: 'common',
    weight: 8,
    apply: (h) => {
      h.armor += 1
    },
  },
  {
    id: 'damage',
    title: 'Dano',
    description: (h) => `Dano ${h.damage} → ${h.damage + 2}`,
    rarity: 'common',
    weight: 10,
    apply: (h) => {
      h.damage += 2
    },
  },
  {
    id: 'crit-chance',
    title: 'Chance de Crítico',
    description: (h) => `Crítico ${h.critChance}% → ${Math.min(MAX_CRIT_CHANCE, h.critChance + 5)}%`,
    rarity: 'rare',
    weight: 6,
    apply: (h) => {
      h.critChance = Math.min(MAX_CRIT_CHANCE, h.critChance + 5)
    },
    available: (h) => h.critChance < MAX_CRIT_CHANCE,
  },
  {
    id: 'crit-damage',
    title: 'Dano Crítico',
    description: (h) => `Bônus do crítico +${h.critBonus} → +${h.critBonus + 3}`,
    rarity: 'rare',
    weight: 6,
    apply: (h) => {
      h.critBonus += 3
    },
  },
  {
    id: 'max-mana',
    title: 'Reserva Arcana',
    description: (h) => `Mana máxima ${h.maxMana} → ${h.maxMana + 10}`,
    rarity: 'common',
    weight: 5,
    apply: (h) => {
      h.maxMana += 10
      h.mana += 10
    },
  },
  {
    id: 'mana-regen',
    title: 'Meditação',
    description: (h) => `Mana por turno ${h.manaRegen} → ${h.manaRegen + 2}`,
    rarity: 'rare',
    weight: 5,
    apply: (h) => {
      h.manaRegen += 2
    },
  },
  {
    id: 'heal-potion',
    title: 'Poção de Cura Melhorada',
    description: (h) => `Cura ${h.potions.heal.effect} → ${h.potions.heal.effect + 3} e +1 poção`,
    rarity: 'common',
    weight: 5,
    apply: (h) => {
      h.potions.heal.effect += 3
      h.potions.heal.amount += 1
    },
  },
  {
    id: 'armor-potion',
    title: 'Poção de Armadura Melhorada',
    description: (h) => `Armadura temporária ${h.potions.armor.effect} → ${h.potions.armor.effect + 1}`,
    rarity: 'rare',
    weight: 3,
    apply: (h) => {
      h.potions.armor.effect += 1
    },
  },
  {
    id: 'restock',
    title: 'Reabastecer',
    description: () => '+1 de cada poção',
    rarity: 'common',
    weight: 6,
    apply: (h) => {
      h.potions.heal.amount += 1
      h.potions.armor.amount += 1
      h.potions.mana.amount += 1
    },
  },
  {
    id: 'full-heal',
    title: 'Fonte Sagrada',
    description: (h) => `Recupera toda a vida (${h.life} → ${h.maxLife})`,
    rarity: 'rare',
    weight: 4,
    apply: (h) => {
      h.life = h.maxLife
    },
    available: (h) => h.life < h.maxLife * 0.7,
  },
  {
    id: 'fury',
    title: 'Fúria',
    description: (h) => `Dano ${h.damage} → ${h.damage + 4}`,
    rarity: 'epic',
    weight: 2,
    apply: (h) => {
      h.damage += 4
    },
  },
  {
    id: 'colossus',
    title: 'Colosso',
    description: (h) => `Vida máxima ${h.maxLife} → ${h.maxLife + 15} e armadura +1`,
    rarity: 'epic',
    weight: 2,
    apply: (h) => {
      h.maxLife += 15
      h.life += 15
      h.armor += 1
    },
  },
]

export function rollUpgrades(hero: Hero, rng: Rng = defaultRng, count = 3): UpgradeDef[] {
  const pool = UPGRADES.filter((u) => u.available?.(hero) ?? true)
  return pickWeighted(rng, pool, count)
}
