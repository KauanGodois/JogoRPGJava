import { type Enemy, createEnemy } from './enemy'
import { type Hero, createHero, recoverBetweenFights } from './hero'
import type { MetaLevels } from './meta'

/** Estado de uma partida (do primeiro inimigo até a derrota). */
export interface RunState {
  hero: Hero
  enemy: Enemy
  level: number
  /** Ouro ganho nesta partida. */
  gold: number
  /** Quanto de `gold` já foi depositado no save (evita somar duas vezes após reviver). */
  goldBanked: number
  revived: boolean
  doubled: boolean
}

export function newRun(meta: MetaLevels): RunState {
  return {
    hero: createHero(meta),
    enemy: createEnemy(1),
    level: 1,
    gold: 0,
    goldBanked: 0,
    revived: false,
    doubled: false,
  }
}

export function collectReward(run: RunState): number {
  run.gold += run.enemy.gold
  return run.enemy.gold
}

export function advanceLevel(run: RunState): void {
  run.level++
  run.enemy = createEnemy(run.level)
  recoverBetweenFights(run.hero)
}

export function revive(run: RunState): void {
  run.revived = true
  run.hero.life = Math.ceil(run.hero.maxLife * 0.5)
  run.hero.mana = run.hero.maxMana
}
