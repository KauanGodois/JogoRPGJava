import Phaser from 'phaser'
import { GROUND_Y, drawBackground } from '../art/background'
import { newRun } from '../logic/run'
import { getSave } from '../save'
import { crazyGames } from '../sdk/crazygames'
import { Button } from '../ui/Button'
import { bindKeys } from '../ui/keys'
import { COLORS, GAME_WIDTH, TEXT, label } from '../ui/theme'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu')
  }

  create(): void {
    crazyGames.gameplayStop()
    drawBackground(this)
    const save = getSave()
    const cx = GAME_WIDTH / 2

    const hero = this.add.image(cx, GROUND_Y + 10, 'hero').setOrigin(0.5, 1).setScale(1.6)
    this.tweens.add({ targets: hero, y: hero.y - 8, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })

    const title = label(this, cx, 110, 'DEFENSOR', 96, TEXT.gold)
    this.tweens.add({ targets: title, scale: 1.04, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    label(this, cx, 180, 'Quantos níveis você consegue sobreviver?', 24, TEXT.muted)

    this.add.image(cx - 120, 250, 'coin')
    label(this, cx - 100, 250, `${save.gold}`, 26, TEXT.gold).setOrigin(0, 0.5)
    label(this, cx + 90, 250, `Recorde: nível ${save.bestLevel}`, 22, TEXT.light)

    const play = () => this.scene.start('Battle', { run: newRun(getSave().meta) })
    const forge = () => this.scene.start('Forge')

    new Button(this, cx, 590, 320, 84, 'JOGAR', play, { color: COLORS.primary, fontSize: 36, hotkey: 'Enter' })
    new Button(this, cx, 672, 320, 56, 'Forja', forge, { fontSize: 24, hotkey: 'F', color: COLORS.button })

    bindKeys(this, { Enter: play, ' ': play, f: forge, F: forge })
  }
}
