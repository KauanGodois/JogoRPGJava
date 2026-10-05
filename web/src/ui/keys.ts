import Phaser from 'phaser'

/** Liga atalhos de teclado (KeyboardEvent.key → ação) e os remove ao sair da cena. */
export function bindKeys(scene: Phaser.Scene, bindings: Record<string, () => void>): void {
  const keyboard = scene.input.keyboard
  if (!keyboard) return
  const handler = (event: KeyboardEvent) => bindings[event.key]?.()
  keyboard.on('keydown', handler)
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => keyboard.off('keydown', handler))
}
