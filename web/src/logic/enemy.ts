export interface EnemyKind {
  name: string
  bossName: string
  /** Cores do sprite: corpo, luz, sombra, olhos, roupa, dentes. */
  palette: { body: number; light: number; dark: number; eye: number; cloth: number; teeth: number }
}

export const ENEMY_KINDS: readonly EnemyKind[] = [
  {
    name: 'Ressurgido',
    bossName: 'Rei Ressurgido',
    palette: { body: 0x6b8f5e, light: 0x9cc48a, dark: 0x3e5a36, eye: 0xff4d3d, cloth: 0x4a3b5c, teeth: 0xe8e2c8 },
  },
  {
    name: 'Goblin',
    bossName: 'Chefe Goblin',
    palette: { body: 0x58a832, light: 0x8bd65a, dark: 0x2f6b1a, eye: 0xffe14d, cloth: 0x7a4a26, teeth: 0xffffff },
  },
  {
    name: 'Esqueleto',
    bossName: 'Lorde Esqueleto',
    palette: { body: 0xd8d2c0, light: 0xffffff, dark: 0x8e8775, eye: 0x4de1ff, cloth: 0x3a3a4a, teeth: 0x1a1626 },
  },
  {
    name: 'Lobisomem',
    bossName: 'Lobisomem Alfa',
    palette: { body: 0x7a5a3a, light: 0xa88360, dark: 0x4a3420, eye: 0xffb84d, cloth: 0x2b4a6b, teeth: 0xffffff },
  },
  {
    name: 'Orc',
    bossName: 'Senhor da Guerra Orc',
    palette: { body: 0x3f7a4a, light: 0x62a86e, dark: 0x234a2a, eye: 0xff3030, cloth: 0x6b2b2b, teeth: 0xf0e8c0 },
  },
  {
    name: 'Demônio',
    bossName: 'Arquidemônio',
    palette: { body: 0xa8332f, light: 0xe0574f, dark: 0x5e1714, eye: 0xffef5c, cloth: 0x1a1626, teeth: 0xffffff },
  },
]

export const LEVELS_PER_TIER = 5

export interface Enemy {
  name: string
  /** Índice em ENEMY_KINDS (define o sprite). */
  kind: number
  level: number
  boss: boolean
  maxLife: number
  life: number
  armor: number
  damage: number
  gold: number
}

export function isBossLevel(level: number): boolean {
  return level % LEVELS_PER_TIER === 0
}

/**
 * Escala inspirada no nextLevel() do Game.java (vida cresce em %, dano +1),
 * suavizada para dar espaço às melhorias. A cada 5 níveis aparece um chefe.
 */
export function createEnemy(level: number): Enemy {
  const kind = Math.floor((level - 1) / LEVELS_PER_TIER) % ENEMY_KINDS.length
  const boss = isBossLevel(level)

  let maxLife = Math.round(5 * 1.2 ** (level - 1)) + 2 * (level - 1)
  let damage = 1 + Math.floor((level - 1) * 0.75)
  let armor = Math.floor((level - 1) / LEVELS_PER_TIER)
  let gold = 4 + level * 2

  if (boss) {
    maxLife = Math.round(maxLife * 1.8)
    damage += 1
    armor += 1
    gold *= 3
  }

  return {
    name: boss ? ENEMY_KINDS[kind].bossName : ENEMY_KINDS[kind].name,
    kind,
    level,
    boss,
    maxLife,
    life: maxLife,
    armor,
    damage,
    gold,
  }
}
