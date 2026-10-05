import Phaser from 'phaser'

export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720

export const FONT = '"Trebuchet MS", "Segoe UI", Verdana, sans-serif'

export const COLORS = {
  outline: 0x0b0912,
  panel: 0x221d33,
  button: 0x4a3f6b,
  primary: 0xc9862b,
  danger: 0xa8332f,
  success: 0x3f8a4a,
  mana: 0x3d7fd6,
  life: 0xe2483d,
  gold: 0xf5c542,
  disabled: 0x3a3548,
  common: 0x8e8aa3,
  rare: 0x3d8fe2,
  epic: 0xb15de8,
}

export const TEXT = {
  light: '#f4ecdc',
  muted: '#a99fbf',
  gold: '#f5c542',
  life: '#ff6b5e',
  mana: '#6fb0ff',
  heal: '#6fe08a',
  danger: '#ff5a4d',
}

export function label(
  scene: Phaser.Scene,
  x: number,
  y: number,
  value: string,
  size = 24,
  color = TEXT.light,
  style: Phaser.Types.GameObjects.Text.TextStyle = {},
): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, value, {
      fontFamily: FONT,
      fontSize: `${size}px`,
      fontStyle: 'bold',
      color,
      stroke: '#0b0912',
      strokeThickness: Math.max(3, Math.round(size / 6)),
      align: 'center',
      ...style,
    })
    .setOrigin(0.5)
}

export function lighten(color: number, amount: number): number {
  return Phaser.Display.Color.IntegerToColor(color).lighten(amount).color
}

export function wait(scene: Phaser.Scene, ms: number): Promise<void> {
  return new Promise((resolve) => scene.time.delayedCall(ms, () => resolve()))
}

export function tween(scene: Phaser.Scene, config: Phaser.Types.Tweens.TweenBuilderConfig): Promise<void> {
  return new Promise((resolve) => scene.tweens.add({ ...config, onComplete: () => resolve() }))
}

/** Escurece a tela com um painel central. */
export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics()
  g.fillStyle(0x000000, 0.35).fillRoundedRect(x - w / 2, y - h / 2 + 8, w, h, 18)
  g.fillStyle(COLORS.panel, 0.96).fillRoundedRect(x - w / 2, y - h / 2, w, h, 18)
  g.lineStyle(4, COLORS.outline, 1).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 18)
  return g
}
