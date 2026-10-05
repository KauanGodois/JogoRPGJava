import Phaser from 'phaser'
import { GROUND_Y, drawBackground } from '../art/background'
import { enemyTextureKey } from '../art/sprites'
import {
  type HeroAction,
  type Hit,
  STRONG_ATTACK_COST,
  canUseStrong,
  endHeroTurn,
  enemyAttack,
  heroAttack,
  heroRawDamage,
  usePotion,
} from '../logic/combat'
import { LEVELS_PER_TIER } from '../logic/enemy'
import { type PotionId, totalArmor } from '../logic/hero'
import { type RunState, collectReward } from '../logic/run'
import { getSave } from '../save'
import { crazyGames } from '../sdk/crazygames'
import { Bar } from '../ui/Bar'
import { Button } from '../ui/Button'
import { bindKeys } from '../ui/keys'
import { COLORS, GAME_WIDTH, TEXT, label, tween, wait } from '../ui/theme'

const HERO_X = 330
const ENEMY_X = 950
const SPRITE_Y = GROUND_Y + 40
const POTION_ORDER: PotionId[] = ['heal', 'armor', 'mana']
const POTION_LABEL: Record<PotionId, string> = { heal: 'Cura', armor: 'Armadura', mana: 'Mana' }

export class BattleScene extends Phaser.Scene {
  private run!: RunState
  private busy = false

  private heroSprite!: Phaser.GameObjects.Image
  private enemySprite!: Phaser.GameObjects.Image
  private heroLife!: Bar
  private heroMana!: Bar
  private enemyLife!: Bar
  private heroStats!: Phaser.GameObjects.Text
  private enemyStats!: Phaser.GameObjects.Text
  private goldText!: Phaser.GameObjects.Text
  private logText!: Phaser.GameObjects.Text

  private actionButtons: Button[] = []
  private potionButtons: Button[] = []
  private basicButton!: Button
  private strongButton!: Button

  constructor() {
    super('Battle')
  }

  init(data: { run: RunState }): void {
    this.run = data.run
    this.busy = true
  }

  create(): void {
    crazyGames.gameplayStart()
    const { enemy } = this.run
    drawBackground(this, Math.floor((enemy.level - 1) / LEVELS_PER_TIER))

    this.createHud()
    this.createActors()
    this.createActions()
    this.refresh(true)
    void this.introduceEnemy()
  }

  // ---------- Montagem da tela ----------

  private createHud(): void {
    const { enemy } = this.run
    const cx = GAME_WIDTH / 2

    label(this, cx, 42, `NÍVEL ${this.run.level}`, 36, TEXT.light)
    if (enemy.boss) {
      const boss = label(this, cx, 82, 'CHEFE', 22, TEXT.danger)
      this.tweens.add({ targets: boss, alpha: 0.4, duration: 500, yoyo: true, repeat: -1 })
    }
    label(this, 30, 42, `Recorde: ${getSave().bestLevel}`, 18, TEXT.muted).setOrigin(0, 0.5)

    this.add.image(GAME_WIDTH - 150, 42, 'coin')
    this.goldText = label(this, GAME_WIDTH - 130, 42, '', 26, TEXT.gold).setOrigin(0, 0.5)

    label(this, HERO_X, 140, 'Defensor', 26)
    this.heroLife = new Bar(this, HERO_X, 178, 300, 26, COLORS.life)
    this.heroMana = new Bar(this, HERO_X, 212, 300, 18, COLORS.mana)
    this.heroStats = label(this, HERO_X, 246, '', 17, TEXT.muted)

    label(this, ENEMY_X, 140, enemy.name, 26, enemy.boss ? TEXT.danger : TEXT.light)
    this.enemyLife = new Bar(this, ENEMY_X, 178, 300, 26, COLORS.life)
    this.enemyStats = label(this, ENEMY_X, 212, '', 17, TEXT.muted)

    this.logText = label(this, cx, 300, '', 22, TEXT.light)
  }

  private createActors(): void {
    const { enemy } = this.run
    const shadow = (x: number, w: number) => this.add.ellipse(x, SPRITE_Y - 4, w, 22, 0x000000, 0.35)

    shadow(HERO_X, 130)
    this.heroSprite = this.add.image(HERO_X, SPRITE_Y, 'hero').setOrigin(0.5, 1).setScale(1.6)
    this.tweens.add({ targets: this.heroSprite, scaleY: 1.64, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })

    const enemyScale = enemy.boss ? 2.1 : 1.6
    shadow(ENEMY_X, enemy.boss ? 170 : 130)
    this.enemySprite = this.add.image(ENEMY_X, SPRITE_Y, enemyTextureKey(enemy.kind)).setOrigin(0.5, 1).setScale(enemyScale)
    this.tweens.add({
      targets: this.enemySprite,
      scaleY: enemyScale * 1.04,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private createActions(): void {
    const g = this.add.graphics()
    g.fillStyle(0x000000, 0.4).fillRect(0, 580, GAME_WIDTH, 140)

    const y = 650
    this.basicButton = new Button(this, 300, y, 300, 92, 'Ataque Básico', () => this.attack('basic'), {
      hotkey: '1',
      subtitle: '',
      color: COLORS.primary,
    })
    this.strongButton = new Button(this, 640, y, 300, 92, 'Ataque Forte', () => this.attack('strong'), {
      hotkey: '2',
      subtitle: '',
      color: COLORS.danger,
    })
    const potions = new Button(this, 980, y, 300, 92, 'Poções', () => this.showPotions(true), {
      hotkey: '3',
      subtitle: 'não gasta o turno',
      color: COLORS.success,
    })
    this.actionButtons = [this.basicButton, this.strongButton, potions]

    this.potionButtons = POTION_ORDER.map((id, i) =>
      new Button(this, 220 + i * 280, y, 250, 92, '', () => this.drinkPotion(id), {
        hotkey: `${i + 1}`,
        subtitle: '',
        color: COLORS.success,
      }),
    )
    this.potionButtons.push(new Button(this, 1060, y, 250, 92, 'Voltar', () => this.showPotions(false), { hotkey: 'Esc' }))
    this.showPotions(false)

    bindKeys(this, {
      '1': () => this.hotkey(0),
      '2': () => this.hotkey(1),
      '3': () => this.hotkey(2),
      Escape: () => this.showPotions(false),
    })
  }

  private hotkey(index: number): void {
    const buttons = this.potionButtons[0].visible ? this.potionButtons : this.actionButtons
    buttons[index]?.press()
  }

  private showPotions(show: boolean): void {
    this.actionButtons.forEach((b) => b.setVisible(!show))
    this.potionButtons.forEach((b) => b.setVisible(show))
  }

  private refresh(instant = false): void {
    const { hero, enemy } = this.run
    this.heroLife.set(hero.life, hero.maxLife, instant)
    this.heroMana.set(hero.mana, hero.maxMana, instant)
    this.enemyLife.set(enemy.life, enemy.maxLife, instant)

    const armor = hero.bonusArmor > 0 ? `${totalArmor(hero)} (+${hero.bonusArmor})` : `${hero.armor}`
    this.heroStats.setText(`Dano ${hero.damage}  ·  Armadura ${armor}  ·  Crítico ${hero.critChance}%`)
    this.enemyStats.setText(`Dano ${enemy.damage}  ·  Armadura ${enemy.armor}`)
    this.goldText.setText(`${getSave().gold + this.run.gold - this.run.goldBanked}`)

    const enabled = !this.busy
    this.basicButton.setLabel('Ataque Básico', `${heroRawDamage(hero, 'basic')} de dano`).setEnabled(enabled)
    this.strongButton
      .setLabel('Ataque Forte', `${heroRawDamage(hero, 'strong')} de dano · ${STRONG_ATTACK_COST} mana`)
      .setEnabled(enabled && canUseStrong(hero))
    this.actionButtons[2].setEnabled(enabled)

    POTION_ORDER.forEach((id, i) => {
      const potion = hero.potions[id]
      this.potionButtons[i]
        .setLabel(`${POTION_LABEL[id]} +${potion.effect}`, `restam ${potion.amount}`)
        .setEnabled(enabled && potion.amount > 0)
    })
  }

  private setBusy(busy: boolean): void {
    this.busy = busy
    this.refresh()
  }

  // ---------- Turnos ----------

  private async introduceEnemy(): Promise<void> {
    const { enemy } = this.run
    const targetX = this.enemySprite.x
    this.enemySprite.setX(targetX + 300).setAlpha(0)
    this.log(enemy.boss ? `${enemy.name} bloqueia o caminho!` : `Um ${enemy.name} apareceu!`)
    if (enemy.boss) this.cameras.main.shake(300, 0.006)
    await tween(this, { targets: this.enemySprite, x: targetX, alpha: 1, duration: 450, ease: 'Back.easeOut' })
    this.setBusy(false)
  }

  private async attack(action: HeroAction): Promise<void> {
    if (this.busy) return
    const { hero, enemy } = this.run
    if (action === 'strong' && !canUseStrong(hero)) return
    this.setBusy(true)

    await this.lunge(this.heroSprite, 1)
    const hit = heroAttack(hero, enemy, action)
    this.showHit(this.enemySprite, hit)
    this.log(`${action === 'strong' ? 'Ataque Forte' : 'Ataque Básico'}${hit.crit ? ' — CRÍTICO!' : ''}`)
    this.refresh()

    if (enemy.life <= 0) {
      await this.enemyDefeated()
      return
    }

    await wait(this, 380)
    await this.lunge(this.enemySprite, -1)
    const enemyHit = enemyAttack(hero, enemy)
    this.showHit(this.heroSprite, enemyHit)
    this.log(`${enemy.name} usou ${enemyHit.strong ? 'Ataque Forte' : 'Ataque Básico'}`)
    this.refresh()

    if (hero.life <= 0) {
      await this.heroDefeated()
      return
    }

    endHeroTurn(hero)
    await wait(this, 200)
    this.setBusy(false)
  }

  private drinkPotion(id: PotionId): void {
    if (this.busy) return
    const result = usePotion(this.run.hero, id)
    if (result === 'empty') this.log('Sem poções desse tipo!')
    if (result === 'full') this.log(id === 'heal' ? 'Vida já está cheia!' : 'Mana já está cheia!')
    if (result === 'ok') {
      const effect = this.run.hero.potions[id].effect
      const colors: Record<PotionId, string> = { heal: TEXT.heal, armor: TEXT.light, mana: TEXT.mana }
      this.floatText(this.heroSprite, `+${effect} ${POTION_LABEL[id]}`, colors[id], 30)
      this.log(`Usou ${this.run.hero.potions[id].name}`)
      this.showPotions(false)
    }
    this.refresh()
  }

  private async enemyDefeated(): Promise<void> {
    const { enemy } = this.run
    const gold = collectReward(this.run)
    if (enemy.boss) crazyGames.happytime()

    this.burst(this.enemySprite, 0xffffff, 30)
    this.tweens.killTweensOf(this.enemySprite)
    void tween(this, { targets: this.enemySprite, alpha: 0, angle: 80, y: SPRITE_Y + 20, duration: 500, ease: 'Quad.easeIn' })
    this.log(`${enemy.name} foi derrotado!`)

    await wait(this, 350)
    this.floatText(this.enemySprite, `+${gold} ouro`, TEXT.gold, 34)
    this.coinShower(this.enemySprite.x, SPRITE_Y - 80, Math.min(14, 4 + Math.floor(gold / 4)))
    this.refresh()

    await wait(this, 1100)
    this.scene.start('Upgrade', { run: this.run, gold })
  }

  private async heroDefeated(): Promise<void> {
    this.tweens.killTweensOf(this.heroSprite)
    this.cameras.main.shake(400, 0.012)
    this.log('Você caiu...')
    await tween(this, { targets: this.heroSprite, angle: -90, alpha: 0.4, duration: 600, ease: 'Quad.easeIn' })
    await wait(this, 600)
    this.scene.start('GameOver', { run: this.run })
  }

  // ---------- Efeitos ----------

  private log(message: string): void {
    this.logText.setText(message).setAlpha(1)
    this.tweens.killTweensOf(this.logText)
    this.tweens.add({ targets: this.logText, alpha: 0.55, delay: 1400, duration: 400 })
  }

  private lunge(sprite: Phaser.GameObjects.Image, direction: 1 | -1): Promise<void> {
    return tween(this, { targets: sprite, x: sprite.x + 90 * direction, duration: 110, yoyo: true, ease: 'Quad.easeOut' })
  }

  private showHit(target: Phaser.GameObjects.Image, hit: Hit): void {
    target.setTintFill(0xffffff)
    this.time.delayedCall(90, () => target.clearTint())

    if (hit.crit) {
      this.cameras.main.shake(180, 0.012)
      this.floatText(target, `${hit.damage}!`, TEXT.gold, 60)
      this.burst(target, COLORS.gold, 24)
    } else {
      this.cameras.main.shake(90, hit.strong ? 0.008 : 0.004)
      this.floatText(target, `${hit.damage}`, target === this.heroSprite ? TEXT.danger : TEXT.light, hit.strong ? 46 : 40)
      this.burst(target, target === this.heroSprite ? COLORS.life : 0xffffff, 10)
    }
  }

  private floatText(target: Phaser.GameObjects.Image, value: string, color: string, size: number): void {
    const x = target.x + Phaser.Math.Between(-30, 30)
    const y = SPRITE_Y - target.displayHeight - 10
    const text = label(this, x, y, value, size, color).setScale(0.4)
    this.tweens.add({ targets: text, scale: 1, duration: 160, ease: 'Back.easeOut' })
    this.tweens.add({
      targets: text,
      y: y - 70,
      alpha: 0,
      delay: 450,
      duration: 650,
      ease: 'Quad.easeIn',
      onComplete: () => text.destroy(),
    })
  }

  private burst(target: Phaser.GameObjects.Image, tint: number, quantity: number): void {
    const emitter = this.add.particles(target.x, SPRITE_Y - target.displayHeight / 2, 'spark', {
      speed: { min: 120, max: 360 },
      lifespan: 500,
      scale: { start: 0.9, end: 0 },
      tint,
      emitting: false,
    })
    emitter.explode(quantity)
    this.time.delayedCall(700, () => emitter.destroy())
  }

  private coinShower(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const coin = this.add.image(x, y, 'coin').setScale(1.4)
      this.tweens.add({
        targets: coin,
        x: GAME_WIDTH - 150,
        y: 42,
        scale: 1,
        delay: i * 45,
        duration: 650,
        ease: 'Cubic.easeIn',
        onComplete: () => coin.destroy(),
      })
    }
  }
}
