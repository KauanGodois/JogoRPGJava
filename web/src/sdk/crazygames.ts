/**
 * Wrapper do CrazyGames SDK v3 (https://docs.crazygames.com/).
 *
 * O script do SDK é carregado no index.html. Fora do CrazyGames (ambiente "disabled"),
 * ou se o script não carregar, todas as chamadas viram no-op e os anúncios recompensados
 * são concedidos direto, para o jogo continuar testável em `npm run dev`.
 */

type AdType = 'midgame' | 'rewarded'

interface AdCallbacks {
  adStarted?: () => void
  adFinished?: () => void
  adError?: (error: unknown) => void
}

interface CrazySDK {
  init(): Promise<void>
  environment: 'local' | 'crazygames' | 'disabled'
  game: {
    gameplayStart(): void
    gameplayStop(): void
    loadingStart(): void
    loadingStop(): void
    happytime(): void
  }
  ad: { requestAd(type: AdType, callbacks: AdCallbacks): void }
  data: { getItem(key: string): string | null; setItem(key: string, value: string): void }
}

declare global {
  interface Window {
    CrazyGames?: { SDK: CrazySDK }
  }
}

class CrazyGamesBridge {
  private sdk: CrazySDK | null = null
  private playing = false

  /** Chamados ao abrir/fechar um anúncio (ex.: mutar o áudio do jogo). */
  onAdStart: () => void = () => {}
  onAdEnd: () => void = () => {}

  get available(): boolean {
    return this.sdk !== null
  }

  async init(): Promise<void> {
    const sdk = window.CrazyGames?.SDK
    if (!sdk) return
    try {
      await sdk.init()
      if (sdk.environment !== 'disabled') this.sdk = sdk
    } catch (error) {
      console.warn('[CrazyGames] SDK indisponível', error)
    }
  }

  loadingStart(): void {
    this.sdk?.game.loadingStart()
  }

  loadingStop(): void {
    this.sdk?.game.loadingStop()
  }

  /** Jogador começou/voltou a jogar (luta, escolha de melhoria). */
  gameplayStart(): void {
    if (this.playing) return
    this.playing = true
    this.sdk?.game.gameplayStart()
  }

  /** Jogador saiu da jogabilidade (menu, derrota, anúncio). */
  gameplayStop(): void {
    if (!this.playing) return
    this.playing = false
    this.sdk?.game.gameplayStop()
  }

  /** Momento de conquista (ex.: derrotar um chefe). */
  happytime(): void {
    this.sdk?.game.happytime()
  }

  /** Anúncio de intervalo em pausas naturais. Resolve quando o jogo pode continuar. */
  midgameAd(): Promise<void> {
    return this.requestAd('midgame').then(() => undefined)
  }

  /** Anúncio recompensado. Resolve `true` se o jogador deve receber a recompensa. */
  rewardedAd(): Promise<boolean> {
    if (!this.sdk) return Promise.resolve(true)
    return this.requestAd('rewarded')
  }

  private requestAd(type: AdType): Promise<boolean> {
    const sdk = this.sdk
    if (!sdk) return Promise.resolve(false)

    const wasPlaying = this.playing
    return new Promise((resolve) => {
      const finish = (watched: boolean) => {
        this.onAdEnd()
        if (wasPlaying) this.gameplayStart()
        resolve(watched)
      }
      sdk.ad.requestAd(type, {
        adStarted: () => {
          this.gameplayStop()
          this.onAdStart()
        },
        adFinished: () => finish(true),
        adError: (error) => {
          console.warn(`[CrazyGames] anúncio ${type} falhou`, error)
          finish(false)
        },
      })
    })
  }

  /** Save na nuvem do CrazyGames quando disponível; localStorage caso contrário. */
  getItem(key: string): string | null {
    try {
      return this.sdk ? this.sdk.data.getItem(key) : localStorage.getItem(key)
    } catch {
      return null
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (this.sdk) this.sdk.data.setItem(key, value)
      else localStorage.setItem(key, value)
    } catch {
      // Armazenamento bloqueado (aba anônima etc.): o jogo segue sem salvar
    }
  }
}

export const crazyGames = new CrazyGamesBridge()
