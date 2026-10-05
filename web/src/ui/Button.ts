import Phaser from 'phaser'
import { COLORS, TEXT, label, lighten } from './theme'

export interface ButtonOptions {
  color?: number
  fontSize?: number
  /** Atalho de teclado exibido no canto (ex.: "1"). */
  hotkey?: string
  subtitle?: string
}

export class Button extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics
  private readonly text: Phaser.GameObjects.Text
  private readonly sub?: Phaser.GameObjects.Text
  private readonly color: number
  private enabled = true
  private hovered = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly bw: number,
    private readonly bh: number,
    text: string,
    private readonly onClick: () => void,
    options: ButtonOptions = {},
  ) {
    super(scene, x, y)
    this.color = options.color ?? COLORS.button

    this.bg = scene.add.graphics()
    const hasSubtitle = options.subtitle !== undefined
    const textY = hasSubtitle ? -11 : 0
    this.text = label(scene, 0, textY, text, options.fontSize ?? 24)
    this.add([this.bg, this.text])

    if (hasSubtitle) {
      this.sub = label(scene, 0, 17, options.subtitle ?? '', 15, TEXT.muted)
      this.add(this.sub)
    }
    if (options.hotkey) {
      this.add(label(scene, -bw / 2 + 16, -bh / 2 + 14, options.hotkey, 14, TEXT.muted))
    }

    this.setSize(bw, bh)
    this.setInteractive({ useHandCursor: true })
    this.on('pointerover', () => {
      this.hovered = true
      this.draw()
    })
    this.on('pointerout', () => {
      this.hovered = false
      this.draw()
    })
    this.on('pointerdown', () => this.press())

    scene.add.existing(this)
    this.draw()
  }

  press(): void {
    if (!this.enabled || !this.visible) return
    this.scene.tweens.add({ targets: this, scale: 0.94, duration: 60, yoyo: true })
    this.onClick()
  }

  setEnabled(enabled: boolean): this {
    this.enabled = enabled
    this.draw()
    return this
  }

  setLabel(text: string, subtitle?: string): this {
    this.text.setText(text)
    if (subtitle !== undefined) this.sub?.setText(subtitle)
    return this
  }

  private draw(): void {
    const { bw: w, bh: h } = this
    const fill = !this.enabled ? COLORS.disabled : this.hovered ? lighten(this.color, 12) : this.color
    this.bg.clear()
    this.bg.fillStyle(0x000000, 0.35).fillRoundedRect(-w / 2, -h / 2 + 6, w, h, 12)
    this.bg.fillStyle(fill, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 12)
    this.bg.fillStyle(0xffffff, this.enabled ? 0.12 : 0.04).fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h / 2 - 4, 8)
    this.bg.lineStyle(3, COLORS.outline, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, 12)
    this.text.setAlpha(this.enabled ? 1 : 0.45)
    this.sub?.setAlpha(this.enabled ? 1 : 0.45)
  }
}
