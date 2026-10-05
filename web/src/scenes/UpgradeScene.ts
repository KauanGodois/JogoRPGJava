import Phaser from 'phaser'
import { drawBackground } from '../art/background'
import { LEVELS_PER_TIER, isBossLevel } from '../logic/enemy'
import { type RunState, advanceLevel } from '../logic/run'
import { RARITY_LABEL, type UpgradeDef, rollUpgrades } from '../logic/upgrades'
import { crazyGames } from '../sdk/crazygames'
import { bindKeys } from '../ui/keys'
import { COLORS, GAME_WIDTH, TEXT, label, lighten } from '../ui/theme'

const CARD_W = 330
const CARD_H = 300

/** Entre as lutas o jogador escolhe 1 de 3 melhorias (substitui a loja do Menu.java). */
export class UpgradeScene extends Phaser.Scene {
  private run!: RunState
  private gold = 0
  private picked = false

  constructor() {
    super('Upgrade')
  }

  init(data: { run: RunState; gold: number }): void {
    this.run = data.run
    this.gold = data.gold
    this.picked = false
  }

  create(): void {
    drawBackground(this, Math.floor((this.run.level - 1) / LEVELS_PER_TIER))
    this.add.rectangle(0, 0, GAME_WIDTH, 720, 0x000000, 0.55).setOrigin(0)
    const cx = GAME_WIDTH / 2

    const title = label(this, cx, 90, 'VITÓRIA!', 64, TEXT.gold).setScale(0.5)
    this.tweens.add({ targets: title, scale: 1, duration: 350, ease: 'Back.easeOut' })
    label(this, cx, 150, `Nível ${this.run.level} concluído  ·  +${this.gold} de ouro`, 24)
    label(this, cx, 200, 'Escolha uma melhoria', 26, TEXT.muted)

    const options = rollUpgrades(this.run.hero)
    const cards = options.map((upgrade, i) => this.createCard(cx + (i - 1) * 380, 400, upgrade, i))
    cards.forEach((card, i) => {
      card.setAlpha(0).setY(card.y + 40)
      this.tweens.add({ targets: card, alpha: 1, y: card.y - 40, delay: 150 + i * 90, duration: 300, ease: 'Quad.easeOut' })
    })

    const { hero } = this.run
    label(
      this,
      cx,
      640,
      `Vida ${hero.life}/${hero.maxLife}  ·  Dano ${hero.damage}  ·  Armadura ${hero.armor}  ·  Crítico ${hero.critChance}%`,
      20,
      TEXT.muted,
    )
    label(this, cx, 676, 'Você recupera parte da vida e toda a mana antes da próxima luta', 16, TEXT.muted)

    bindKeys(this, {
      '1': () => this.choose(options[0]),
      '2': () => this.choose(options[1]),
      '3': () => this.choose(options[2]),
    })
  }

  private createCard(x: number, y: number, upgrade: UpgradeDef, index: number): Phaser.GameObjects.Container {
    const color = COLORS[upgrade.rarity]
    const card = this.add.container(x, y)
    const bg = this.add.graphics()
    const draw = (hover: boolean) => {
      const w = CARD_W
      const h = CARD_H
      bg.clear()
      bg.fillStyle(0x000000, 0.4).fillRoundedRect(-w / 2, -h / 2 + 8, w, h, 16)
      bg.fillStyle(hover ? 0x2f2846 : COLORS.panel, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 16)
      bg.fillStyle(color, 1).fillRoundedRect(-w / 2, -h / 2, w, 54, { tl: 16, tr: 16, bl: 0, br: 0 })
      bg.lineStyle(4, hover ? lighten(color, 20) : COLORS.outline, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, 16)
    }
    draw(false)

    card.add([
      bg,
      label(this, 0, -CARD_H / 2 + 27, RARITY_LABEL[upgrade.rarity].toUpperCase(), 20),
      label(this, -CARD_W / 2 + 20, -CARD_H / 2 + 27, `${index + 1}`, 16, TEXT.light),
      label(this, 0, -40, upgrade.title, 28, TEXT.light, { wordWrap: { width: CARD_W - 40 } }),
      label(this, 0, 40, upgrade.description(this.run.hero), 21, TEXT.muted, { wordWrap: { width: CARD_W - 50 } }),
    ])

    card.setSize(CARD_W, CARD_H).setInteractive({ useHandCursor: true })
    card.on('pointerover', () => {
      draw(true)
      card.setScale(1.04)
    })
    card.on('pointerout', () => {
      draw(false)
      card.setScale(1)
    })
    card.on('pointerdown', () => this.choose(upgrade))
    return card
  }

  private async choose(upgrade: UpgradeDef | undefined): Promise<void> {
    if (!upgrade || this.picked) return
    this.picked = true
    upgrade.apply(this.run.hero)
    this.cameras.main.flash(150, 255, 255, 255)

    // Anúncio de intervalo só depois de chefes: pausa natural e pouco intrusiva
    const beatBoss = isBossLevel(this.run.level)
    advanceLevel(this.run)
    if (beatBoss) await crazyGames.midgameAd()

    this.scene.start('Battle', { run: this.run })
  }
}
