/** Melhorias permanentes (compradas com ouro na Forja e mantidas entre partidas). */
export type MetaId = 'life' | 'damage' | 'armor' | 'crit' | 'potions'

export type MetaLevels = Record<MetaId, number>

export interface MetaDef {
  id: MetaId
  title: string
  description: string
  baseCost: number
  max: number
}

export const META_DEFS: readonly MetaDef[] = [
  { id: 'life', title: 'Vitalidade', description: '+5 de vida máxima inicial', baseCost: 10, max: 20 },
  { id: 'damage', title: 'Lâmina Afiada', description: '+1 de dano inicial', baseCost: 15, max: 15 },
  { id: 'armor', title: 'Couraça', description: '+1 de armadura inicial', baseCost: 25, max: 10 },
  { id: 'crit', title: 'Olho Clínico', description: '+2% de chance de crítico', baseCost: 12, max: 15 },
  { id: 'potions', title: 'Alquimia', description: '+1 Poção de Cura inicial', baseCost: 20, max: 5 },
]

export function emptyMeta(): MetaLevels {
  return { life: 0, damage: 0, armor: 0, crit: 0, potions: 0 }
}

export function metaCost(def: MetaDef, level: number): number {
  return Math.round(def.baseCost * 1.6 ** level)
}
