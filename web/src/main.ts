import Phaser from 'phaser'
import { BattleScene } from './scenes/BattleScene'
import { BootScene } from './scenes/BootScene'
import { ForgeScene } from './scenes/ForgeScene'
import { GameOverScene } from './scenes/GameOverScene'
import { MenuScene } from './scenes/MenuScene'
import { UpgradeScene } from './scenes/UpgradeScene'
import { GAME_HEIGHT, GAME_WIDTH } from './ui/theme'

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0b0912',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, ForgeScene, BattleScene, UpgradeScene, GameOverScene],
})

// Facilita depurar pelo console do navegador em `npm run dev`
if (import.meta.env.DEV) Object.assign(window, { game })

// CrazyGames pede para não abrir o menu de contexto e não rolar a página com o teclado
window.addEventListener('contextmenu', (event) => event.preventDefault())
window.addEventListener('keydown', (event) => {
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault()
})
