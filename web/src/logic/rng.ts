/** Gerador de aleatórios injetável (Math.random em produção, determinístico nos testes). */
export type Rng = () => number

export const defaultRng: Rng = Math.random

/** Sorteia `count` itens distintos, respeitando o peso de cada um. */
export function pickWeighted<T extends { weight: number }>(rng: Rng, items: readonly T[], count: number): T[] {
  const pool = [...items]
  const picked: T[] = []
  while (picked.length < count && pool.length > 0) {
    const total = pool.reduce((sum, item) => sum + item.weight, 0)
    let roll = rng() * total
    let index = pool.findIndex((item) => (roll -= item.weight) < 0)
    if (index === -1) index = pool.length - 1
    picked.push(pool.splice(index, 1)[0])
  }
  return picked
}
