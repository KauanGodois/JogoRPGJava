import Phaser from 'phaser'
import { COLORS, label } from './theme'

/** Barra de vida/mana com animação e "rastro" do dano recebido. */
export class Bar extends Phaser.GameObjects.Container {
  private readonly g: Phaser.GameObjects.Graphics
  private readonly text: Phaser.GameObjects.Text
  private readonly anim = { value: 1, trail: 1 }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly barWidth: number,
    private readonly barHeight: number,
    private readonly color: number,
  ) {
    super(scene, x, y)
    this.g = scene.add.graphics()
    this.text = label(scene, 0, 0, '', Math.round(barHeight * 0.7))
    this.add([this.g, this.text])
    scene.add.existing(this)
  }

  set(current: number, max: number, instant = false): this {
    const ratio = max > 0 ? Phaser.Math.Clamp(current / max, 0, 1) : 0
    this.text.setText(`${current}/${max}`)
    this.scene.tweens.killTweensOf(this.anim)

    if (instant) {
      this.anim.value = this.anim.trail = ratio
      this.draw()
      return this
    }

    const onUpdate = () => this.draw()
    if (ratio < this.anim.value) {
      this.scene.tweens.add({ targets: this.anim, value: ratio, duration: 180, ease: 'Quad.easeOut', onUpdate })
      this.scene.tweens.add({ targets: this.anim, trail: ratio, delay: 350, duration: 400, onUpdate })
    } else {
      this.anim.trail = ratio
      this.scene.tweens.add({ targets: this.anim, value: ratio, duration: 300, ease: 'Quad.easeOut', onUpdate })
    }
    return this
  }

  private draw(): void {
    const { barWidth: w, barHeight: h } = this
    const x = -w / 2
    const y = -h / 2
    this.g.clear()
    this.g.fillStyle(COLORS.outline, 1).fillRoundedRect(x - 3, y - 3, w + 6, h + 6, 6)
    this.g.fillStyle(0x2a2436, 1).fillRect(x, y, w, h)
    this.g.fillStyle(0xfff3d6, 0.85).fillRect(x, y, w * this.anim.trail, h)
    this.g.fillStyle(this.color, 1).fillRect(x, y, w * this.anim.value, h)
    this.g.fillStyle(0xffffff, 0.18).fillRect(x, y, w * this.anim.value, h * 0.4)
  }
}
