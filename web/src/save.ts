import { type MetaLevels, emptyMeta } from './logic/meta'
import type { RunState } from './logic/run'
import { crazyGames } from './sdk/crazygames'

const SAVE_KEY = 'defensor-save'

export interface SaveData {
  version: 1
  gold: number
  bestLevel: number
  meta: MetaLevels
}

let current: SaveData = defaultSave()

function defaultSave(): SaveData {
  return { version: 1, gold: 0, bestLevel: 0, meta: emptyMeta() }
}

export function loadSave(): SaveData {
  current = defaultSave()
  const raw = crazyGames.getItem(SAVE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<SaveData>
      current = {
        version: 1,
        gold: Number(parsed.gold) || 0,
        bestLevel: Number(parsed.bestLevel) || 0,
        meta: { ...emptyMeta(), ...parsed.meta },
      }
    } catch {
      // Save corrompido: começa do zero
    }
  }
  return current
}

export function getSave(): SaveData {
  return current
}

export function persist(): void {
  crazyGames.setItem(SAVE_KEY, JSON.stringify(current))
}

/** Deposita no save o ouro da partida que ainda não foi guardado e atualiza o recorde. */
export function bankRun(run: RunState): void {
  current.gold += run.gold - run.goldBanked
  run.goldBanked = run.gold
  current.bestLevel = Math.max(current.bestLevel, run.level)
  persist()
}
