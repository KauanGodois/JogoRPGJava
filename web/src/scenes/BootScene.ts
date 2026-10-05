import Phaser from 'phaser'
import { generateTextures } from '../art/sprites'
import { loadSave } from '../save'
import { crazyGames } from '../sdk/crazygames'
import { GAME_HEIGHT, GAME_WIDTH, TEXT, label } from '../ui/theme'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  create(): void {
    label(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Carregando...', 28, TEXT.muted)
    void this.boot()
  }

  private async boot(): Promise<void> {
    await crazyGames.init()
    crazyGames.loadingStart()
    crazyGames.onAdStart = () => {
      this.sound.mute = true
    }
    crazyGames.onAdEnd = () => {
      this.sound.mute = false
    }

    generateTextures(this)
    loadSave()

    crazyGames.loadingStop()
    this.scene.start('Menu')
  }
}
