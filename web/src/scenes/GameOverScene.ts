import Phaser from 'phaser'
import { drawBackground } from '../art/background'
import { type RunState, revive } from '../logic/run'
import { bankRun, getSave, persist } from '../save'
import { crazyGames } from '../sdk/crazygames'
import { Button } from '../ui/Button'
import { bindKeys } from '../ui/keys'
import { COLORS, GAME_WIDTH, TEXT, label, panel } from '../ui/theme'

export class GameOverScene extends Phaser.Scene {
  private run!: RunState
  private previousBest = 0
  private busy = false

  constructor() {
    super('GameOver')
  }

  init(data: { run: RunState }): void {
    this.run = data.run
    this.busy = false
  }

  create(): void {
    crazyGames.gameplayStop()
    this.previousBest = getSave().bestLevel
    // Deposita o ouro já, para não perder nada se o jogador fechar a aba
    bankRun(this.run)

    drawBackground(this, 5)
    this.add.rectangle(0, 0, GAME_WIDTH, 720, 0x000000, 0.5).setOrigin(0)
    const cx = GAME_WIDTH / 2
    panel(this, cx, 360, 620, 600)

    label(this, cx, 115, 'VOCÊ CAIU', 60, TEXT.danger)
    label(this, cx, 190, `Nível alcançado: ${this.run.level}`, 30)
    if (this.run.level > this.previousBest) {
      const record = label(this, cx, 232, 'NOVO RECORDE!', 24, TEXT.gold)
      this.tweens.add({ targets: record, scale: 1.12, duration: 450, yoyo: true, repeat: -1 })
    } else {
      label(this, cx, 232, `Recorde: nível ${this.previousBest}`, 22, TEXT.muted)
    }
    const goldText = label(this, cx, 280, '', 26, TEXT.gold)
    const updateGold = () => goldText.setText(`Ouro desta partida: ${this.run.gold}${this.run.doubled ? ' (x2)' : ''}`)
    updateGold()

    let y = 375
    if (!this.run.revived) {
      new Button(this, cx, y, 420, 76, '▶  Reviver', () => this.revive(), {
        color: COLORS.success,
        subtitle: 'assista um anúncio · volta com 50% de vida',
        fontSize: 28,
      })
      y += 96
    }
    if (!this.run.doubled && this.run.gold > 0) {
      const doubleButton: Button = new Button(
        this,
        cx,
        y,
        420,
        76,
        '▶  Dobrar ouro',
        () => this.doubleGold(doubleButton, updateGold),
        { color: COLORS.primary, subtitle: `assista um anúncio · +${this.run.gold} de ouro`, fontSize: 28 },
      )
      y += 96
    }
    const toMenu = () => this.toMenu()
    new Button(this, cx, Math.max(y, 570), 420, 70, 'Menu', toMenu, { hotkey: 'Enter', fontSize: 28 })
    bindKeys(this, { Enter: toMenu, Escape: toMenu })
  }

  private async revive(): Promise<void> {
    if (this.busy) return
    this.busy = true
    const rewarded = await crazyGames.rewardedAd()
    this.busy = false
    if (!rewarded) return
    revive(this.run)
    this.scene.start('Battle', { run: this.run })
  }

  private async doubleGold(button: Button, onDone: () => void): Promise<void> {
    if (this.busy || this.run.doubled) return
    this.busy = true
    const rewarded = await crazyGames.rewardedAd()
    this.busy = false
    if (!rewarded) return
    this.run.doubled = true
    // Bônus vai direto para o save (não entra em run.gold para não ser depositado de novo)
    getSave().gold += this.run.gold
    persist()
    button.setEnabled(false).setLabel('Ouro dobrado!', '')
    onDone()
    this.cameras.main.flash(150, 245, 197, 66)
  }

  private async toMenu(): Promise<void> {
    if (this.busy) return
    this.busy = true
    await crazyGames.midgameAd()
    this.scene.start('Menu')
  }
}
