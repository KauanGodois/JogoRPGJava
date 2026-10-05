import Phaser from 'phaser'
import { drawBackground } from '../art/background'
import { META_DEFS, type MetaDef, metaCost } from '../logic/meta'
import { getSave, persist } from '../save'
import { Button } from '../ui/Button'
import { bindKeys } from '../ui/keys'
import { GAME_WIDTH, TEXT, label, panel } from '../ui/theme'

/** Melhorias permanentes compradas com o ouro acumulado entre partidas. */
export class ForgeScene extends Phaser.Scene {
  private goldText!: Phaser.GameObjects.Text
  private rows: { def: MetaDef; level: Phaser.GameObjects.Text; button: Button }[] = []

  constructor() {
    super('Forge')
  }

  create(): void {
    drawBackground(this, 4)
    const cx = GAME_WIDTH / 2
    panel(this, cx, 370, 900, 600)

    label(this, cx, 115, 'FORJA', 52, TEXT.gold)
    label(this, cx, 160, 'Melhorias permanentes para todas as partidas', 20, TEXT.muted)
    this.add.image(cx + 330, 118, 'coin')
    this.goldText = label(this, cx + 350, 118, '', 28, TEXT.gold).setOrigin(0, 0.5)

    this.rows = META_DEFS.map((def, i) => {
      const y = 225 + i * 84
      label(this, cx - 410, y - 14, def.title, 26).setOrigin(0, 0.5)
      label(this, cx - 410, y + 16, def.description, 18, TEXT.muted).setOrigin(0, 0.5)
      const level = label(this, cx + 70, y, '', 22).setOrigin(0.5)
      const button = new Button(this, cx + 290, y, 220, 60, '', () => this.buy(def), { fontSize: 22 })
      return { def, level, button }
    })

    const back = () => this.scene.start('Menu')
    new Button(this, cx, 650, 260, 60, 'Voltar', back, { hotkey: 'Esc' })
    bindKeys(this, { Escape: back })

    this.refresh()
  }

  private buy(def: MetaDef): void {
    const save = getSave()
    const level = save.meta[def.id]
    const cost = metaCost(def, level)
    if (level >= def.max || save.gold < cost) return
    save.gold -= cost
    save.meta[def.id] = level + 1
    persist()
    this.cameras.main.flash(120, 245, 197, 66)
    this.refresh()
  }

  private refresh(): void {
    const save = getSave()
    this.goldText.setText(`${save.gold}`)
    for (const row of this.rows) {
      const level = save.meta[row.def.id]
      row.level.setText(`Nv ${level}/${row.def.max}`)
      if (level >= row.def.max) {
        row.button.setLabel('MÁXIMO').setEnabled(false)
      } else {
        const cost = metaCost(row.def, level)
        row.button.setLabel(`Melhorar · ${cost} ouro`).setEnabled(save.gold >= cost)
      }
    }
  }
}
