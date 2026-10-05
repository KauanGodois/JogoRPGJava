import { describe, expect, it } from 'vitest'
import { STRONG_ATTACK_COST, canUseStrong, endHeroTurn, enemyAttack, heroAttack, usePotion } from './combat'
import { createEnemy } from './enemy'
import { createHero } from './hero'
import { emptyMeta, META_DEFS, metaCost } from './meta'
import { advanceLevel, collectReward, newRun, revive } from './run'
import { UPGRADES, rollUpgrades } from './upgrades'

const always = (value: number) => () => value
const noCrit = always(0.99)
const crit = always(0)

describe('herói', () => {
  it('começa com os valores do Defender.java', () => {
    const hero = createHero(emptyMeta())
    expect(hero).toMatchObject({ maxLife: 25, life: 25, maxMana: 20, damage: 3, critChance: 7, critBonus: 6, armor: 0 })
  })

  it('aplica as melhorias permanentes', () => {
    const hero = createHero({ life: 2, damage: 1, armor: 3, crit: 4, potions: 2 })
    expect(hero).toMatchObject({ maxLife: 35, damage: 4, armor: 3, critChance: 15 })
    expect(hero.potions.heal.amount).toBe(5)
  })
})

describe('combate', () => {
  it('ataque básico subtrai a armadura do inimigo', () => {
    const hero = createHero(emptyMeta())
    const enemy = createEnemy(1)
    enemy.armor = 1
    expect(heroAttack(hero, enemy, 'basic', noCrit)).toEqual({ damage: 2, crit: false, strong: false })
    expect(enemy.life).toBe(enemy.maxLife - 2)
  })

  it('dano mínimo é 1, mesmo com armadura alta', () => {
    const hero = createHero(emptyMeta())
    const enemy = createEnemy(1)
    enemy.armor = 50
    expect(heroAttack(hero, enemy, 'basic', noCrit).damage).toBe(1)
  })

  it('crítico soma o bônus de dano crítico', () => {
    const hero = createHero(emptyMeta())
    const enemy = createEnemy(10)
    enemy.armor = 0
    expect(heroAttack(hero, enemy, 'basic', crit)).toMatchObject({ damage: 3 + 6, crit: true })
  })

  it('ataque forte gasta mana e exige mana suficiente', () => {
    const hero = createHero(emptyMeta())
    const enemy = createEnemy(10)
    enemy.armor = 0
    expect(heroAttack(hero, enemy, 'strong', noCrit).damage).toBe(Math.round(3 * 1.5) + 3)
    expect(hero.mana).toBe(20 - STRONG_ATTACK_COST)
    expect(canUseStrong(hero)).toBe(false)
    expect(() => heroAttack(hero, enemy, 'strong', noCrit)).toThrow()
  })

  it('vida nunca fica negativa', () => {
    const hero = createHero(emptyMeta())
    const enemy = createEnemy(1)
    enemy.life = 1
    heroAttack(hero, enemy, 'basic', crit)
    expect(enemy.life).toBe(0)
  })

  it('inimigo usa ataque forte (+2) e respeita a armadura total do herói', () => {
    const hero = createHero(emptyMeta())
    const enemy = createEnemy(9)
    hero.armor = 1
    hero.bonusArmor = 1
    expect(enemyAttack(hero, enemy, always(0)).damage).toBe(enemy.damage + 2 - 2)
    expect(enemyAttack(hero, enemy, always(0.9)).damage).toBe(enemy.damage - 2)
  })

  it('mana regenera até o máximo', () => {
    const hero = createHero(emptyMeta())
    hero.mana = 18
    endHeroTurn(hero)
    expect(hero.mana).toBe(20)
  })
})

describe('poções', () => {
  it('cura até a vida máxima e consome a poção', () => {
    const hero = createHero(emptyMeta())
    hero.life = 23
    expect(usePotion(hero, 'heal')).toBe('ok')
    expect(hero.life).toBe(25)
    expect(hero.potions.heal.amount).toBe(2)
  })

  it('não desperdiça poção com vida ou mana cheias', () => {
    const hero = createHero(emptyMeta())
    expect(usePotion(hero, 'heal')).toBe('full')
    expect(usePotion(hero, 'mana')).toBe('full')
    expect(hero.potions.heal.amount).toBe(3)
  })

  it('poção de armadura dá armadura temporária (no Java ela curava vida por engano)', () => {
    const hero = createHero(emptyMeta())
    expect(usePotion(hero, 'armor')).toBe('ok')
    expect(hero.bonusArmor).toBe(1)
    expect(hero.life).toBe(25)
  })

  it('avisa quando a poção acabou', () => {
    const hero = createHero(emptyMeta())
    hero.potions.mana.amount = 0
    hero.mana = 0
    expect(usePotion(hero, 'mana')).toBe('empty')
  })
})

describe('inimigos', () => {
  it('nível 1 é o Ressurgido do jogo original', () => {
    expect(createEnemy(1)).toMatchObject({ name: 'Ressurgido', maxLife: 5, damage: 1, armor: 0, boss: false })
  })

  it('a cada 5 níveis aparece um chefe mais forte', () => {
    const regular = createEnemy(4)
    const boss = createEnemy(5)
    expect(boss.boss).toBe(true)
    expect(boss.name).toBe('Rei Ressurgido')
    expect(boss.maxLife).toBeGreaterThan(regular.maxLife * 1.5)
    expect(createEnemy(6).name).toBe('Goblin')
  })

  it('fica mais forte a cada nível', () => {
    for (let level = 1; level < 40; level++) {
      const a = createEnemy(level)
      const b = createEnemy(level + 1)
      if (a.boss) continue
      expect(b.maxLife).toBeGreaterThan(a.maxLife)
      expect(b.damage).toBeGreaterThanOrEqual(a.damage)
    }
  })
})

describe('melhorias', () => {
  it('sorteia 3 melhorias diferentes', () => {
    const hero = createHero(emptyMeta())
    for (let i = 0; i < 50; i++) {
      const ids = rollUpgrades(hero).map((u) => u.id)
      expect(new Set(ids).size).toBe(3)
    }
  })

  it('não oferece cura total com a vida cheia', () => {
    const hero = createHero(emptyMeta())
    for (let i = 0; i < 100; i++) {
      expect(rollUpgrades(hero).some((u) => u.id === 'full-heal')).toBe(false)
    }
  })

  it('toda melhoria altera o herói', () => {
    for (const upgrade of UPGRADES) {
      const hero = createHero(emptyMeta())
      hero.life = 10
      const before = JSON.stringify(hero)
      upgrade.apply(hero)
      expect(JSON.stringify(hero), upgrade.id).not.toBe(before)
    }
  })

  it('custo da forja cresce por nível', () => {
    for (const def of META_DEFS) expect(metaCost(def, 3)).toBeGreaterThan(metaCost(def, 2))
  })
})

describe('partida', () => {
  it('avança de nível, recupera parte da vida e zera a armadura temporária', () => {
    const run = newRun(emptyMeta())
    run.hero.life = 5
    run.hero.mana = 0
    run.hero.bonusArmor = 2
    expect(collectReward(run)).toBe(run.enemy.gold)
    advanceLevel(run)
    expect(run.level).toBe(2)
    expect(run.enemy.level).toBe(2)
    expect(run.hero.life).toBe(5 + Math.ceil(25 * 0.35))
    expect(run.hero.mana).toBe(20)
    expect(run.hero.bonusArmor).toBe(0)
  })

  it('reviver devolve metade da vida uma vez', () => {
    const run = newRun(emptyMeta())
    run.hero.life = 0
    revive(run)
    expect(run.hero.life).toBe(13)
    expect(run.revived).toBe(true)
  })
})
