import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../ui/theme'

export const GROUND_Y = 470

/** Céu (topo, horizonte) por grupo de inimigos. */
const SKIES: readonly [number, number][] = [
  [0x16122b, 0x4a2f5e],
  [0x10202a, 0x2f5e4a],
  [0x15151f, 0x4a4a5e],
  [0x0f1430, 0x3a3f7a],
  [0x1f1410, 0x6b3a22],
  [0x200a0a, 0x7a1f1a],
]

function lerpColor(from: number, to: number, t: number): number {
  const a = Phaser.Display.Color.IntegerToColor(from)
  const b = Phaser.Display.Color.IntegerToColor(to)
  return Phaser.Display.Color.GetColor(
    Math.round(a.red + (b.red - a.red) * t),
    Math.round(a.green + (b.green - a.green) * t),
    Math.round(a.blue + (b.blue - a.blue) * t),
  )
}

export function drawBackground(scene: Phaser.Scene, tier = 0): void {
  const [top, horizon] = SKIES[tier % SKIES.length]
  const g = scene.add.graphics()

  // Céu em faixas (funciona também no renderer Canvas, que não tem gradiente)
  const bands = 24
  const bandHeight = GROUND_Y / bands
  for (let i = 0; i < bands; i++) {
    g.fillStyle(lerpColor(top, horizon, i / (bands - 1)), 1)
    g.fillRect(0, Math.floor(i * bandHeight), GAME_WIDTH, Math.ceil(bandHeight) + 1)
  }

  // Estrelas
  const rnd = new Phaser.Math.RandomDataGenerator([`stars-${tier}`])
  for (let i = 0; i < 60; i++) {
    g.fillStyle(0xffffff, rnd.realInRange(0.2, 0.8))
    const size = rnd.pick([2, 2, 3])
    g.fillRect(rnd.between(0, GAME_WIDTH), rnd.between(0, GROUND_Y - 160), size, size)
  }

  // Lua
  g.fillStyle(0xfff0c8, 0.06).fillCircle(1080, 120, 90)
  g.fillStyle(0xfff0c8, 0.1).fillCircle(1080, 120, 64)
  g.fillStyle(0xf3e6c4, 1).fillCircle(1080, 120, 44)

  // Montanhas
  const mountains = (color: number, base: number, peaks: number[][]) => {
    g.fillStyle(color, 1)
    g.fillPoints(
      [
        { x: 0, y: GROUND_Y },
        ...peaks.map(([x, y]) => ({ x, y: base - y })),
        { x: GAME_WIDTH, y: GROUND_Y },
      ],
      true,
    )
  }
  const far = lerpColor(horizon, 0x0b0912, 0.55)
  const near = lerpColor(horizon, 0x0b0912, 0.75)
  mountains(far, GROUND_Y, [[0, 120], [160, 230], [320, 140], [470, 260], [640, 150], [820, 240], [980, 130], [1140, 210], [1280, 120]])
  mountains(near, GROUND_Y, [[0, 60], [120, 120], [260, 70], [420, 140], [600, 60], [760, 130], [940, 70], [1100, 120], [1280, 60]])

  // Chão de pedra
  g.fillStyle(0x2a2433, 1).fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y)
  g.fillStyle(0x3d3448, 1).fillRect(0, GROUND_Y, GAME_WIDTH, 10)
  for (let i = 0; i < 70; i++) {
    g.fillStyle(rnd.pick([0x221d2b, 0x332b3e, 0x3a3247]), 1)
    g.fillRect(rnd.between(0, GAME_WIDTH), rnd.between(GROUND_Y + 16, GAME_HEIGHT), rnd.between(10, 34), rnd.between(4, 8))
  }
}
