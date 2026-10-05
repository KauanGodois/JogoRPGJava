import Phaser from 'phaser'
import { ENEMY_KINDS } from '../logic/enemy'

/**
 * Sprites provisórios em pixel art desenhados por código (cada caractere = 1 pixel).
 * Para trocar por arte final, carregue PNGs no BootScene com as mesmas chaves.
 */

export const PIXEL = 6

const HERO = [
  '................',
  '......rrr.......',
  '.....rrkkk......',
  '....kSSSSSk.....',
  '....kSkkkSk.....',
  '....kSffkSk.....',
  '....kSSSSsk...w.',
  '...kkkkkkkk..ww.',
  '..kbbkSSsSk.ww..',
  '.kbyybkSsSkww...',
  '.kbyybkSSkyy....',
  '.kbbbbkSsSkk....',
  '..kkkkbbbbk.....',
  '....kSk..kSk....',
  '....kSk..kSk....',
  '...kkkk..kkkk...',
]

const HERO_PALETTE: Record<string, number> = {
  k: 0x1a1626,
  S: 0xc4cedf,
  s: 0x7d8aa3,
  r: 0xd8433a,
  f: 0xf0c8a0,
  b: 0x8a5a2b,
  y: 0xf5c542,
  w: 0xe8eef5,
}

const MONSTER = [
  '................',
  '.....kkkkkk.....',
  '....kGGggggk....',
  '...kGgggggggk...',
  '...kgeeggeegk...',
  '...kggggggggk...',
  '....kgkttkgk....',
  '..kkkggggggkkk..',
  '.kggkppppppkggk.',
  '.kgk.kppppk.kgk.',
  '.kgk.kppppk.kgk.',
  '..kd.kppppk.dk..',
  '.....kppppk.....',
  '.....kgkkgk.....',
  '.....kdkkdk.....',
  '....kkk..kkk....',
]

const COIN = [
  '..kkkk..',
  '.kyyyyk.',
  'kyYyyyyk',
  'kyYyyyyk',
  'kyyyyyyk',
  'kyyyyyyk',
  '.kyyyyk.',
  '..kkkk..',
]

const COIN_PALETTE: Record<string, number> = { k: 0x5a3d0a, y: 0xf5c542, Y: 0xfff3b0 }

export function pixelTexture(
  scene: Phaser.Scene,
  key: string,
  rows: readonly string[],
  palette: Record<string, number>,
  scale = PIXEL,
): void {
  const g = scene.add.graphics()
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = palette[row[x]]
      if (color === undefined) continue
      g.fillStyle(color, 1).fillRect(x * scale, y * scale, scale, scale)
    }
  })
  g.generateTexture(key, rows[0].length * scale, rows.length * scale)
  g.destroy()
  scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST)
}

export const enemyTextureKey = (kind: number) => `enemy-${kind}`

export function generateTextures(scene: Phaser.Scene): void {
  pixelTexture(scene, 'hero', HERO, HERO_PALETTE)
  ENEMY_KINDS.forEach((kind, index) => {
    const p = kind.palette
    pixelTexture(scene, enemyTextureKey(index), MONSTER, {
      k: 0x1a1626,
      g: p.body,
      G: p.light,
      d: p.dark,
      e: p.eye,
      p: p.cloth,
      t: p.teeth,
    })
  })
  pixelTexture(scene, 'coin', COIN, COIN_PALETTE, 3)

  const g = scene.add.graphics()
  g.fillStyle(0xffffff, 1).fillRect(0, 0, 8, 8)
  g.generateTexture('spark', 8, 8)
  g.destroy()
}
