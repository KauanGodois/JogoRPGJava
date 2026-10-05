# Defensor (versão web)

Port do RPG de turnos em Java (`../src/Jogo`) para o navegador, pensado para publicar no **CrazyGames**.

**Stack:** Phaser 3 + TypeScript + Vite. Testes com Vitest.

## Rodando

```bash
cd web
npm install
npm run dev       # http://localhost:5173
npm test          # testes da lógica do jogo
npm run build     # gera dist/ (é isso que vai para o CrazyGames)
npm run preview   # serve o build localmente
```

No `npm run dev` o jogo fica exposto como `window.game` no console do navegador, para depuração.

## Como o jogo funciona

- **Batalha por turnos:** Ataque Básico, Ataque Forte (20 de mana) e Poções (Cura, Armadura e Mana; não gastam o turno). A mana regenera a cada turno.
- **Inimigos escalam por nível.** A cada 5 níveis aparece um **chefe**, e muda o tipo de inimigo e o cenário.
- **Entre as lutas:** escolha 1 de 3 melhorias (Comum/Raro/Épico) e recupere parte da vida.
- **Forja:** o ouro de cada partida fica salvo e compra melhorias permanentes.
- **Derrota:** reviver uma vez ou dobrar o ouro com anúncio recompensado.

## Estrutura

```
src/
  logic/     regras puras (sem Phaser): herói, inimigos, combate, melhorias, partida
  scenes/    Boot → Menu ⇄ Forja, Batalha → Melhoria → Batalha … → Game Over
  ui/        Button, Bar, tema e atalhos de teclado
  art/       pixel art e cenário desenhados por código (provisórios)
  sdk/       wrapper do CrazyGames SDK v3
  save.ts    save (CrazyGames Data quando disponível, senão localStorage)
```

Toda a regra do jogo fica em `src/logic` e tem testes em `logic.test.ts`. Para mexer no balanceamento, altere os números em `enemy.ts`, `hero.ts` e `upgrades.ts`.

## CrazyGames

O SDK v3 é carregado no `index.html` e usado por `src/sdk/crazygames.ts`:

| Chamada | Onde |
|---|---|
| `loadingStart/Stop` | BootScene |
| `gameplayStart` | início de cada batalha |
| `gameplayStop` | menu e game over |
| `happytime` | ao derrotar um chefe |
| anúncio `midgame` | depois de cada chefe e ao voltar ao menu pelo game over |
| anúncio `rewarded` | Reviver e Dobrar ouro |
| `data.getItem/setItem` | save |

Fora do CrazyGames, o SDK fica desativado: as chamadas não fazem nada e os anúncios recompensados são concedidos direto.

**Para enviar:** `npm run build`, compacte o **conteúdo** de `dist/` em um .zip e faça o upload no portal de desenvolvedores do CrazyGames. O build usa caminhos relativos (`base: './'`).

## Próximos passos sugeridos

- Arte final (substituir as texturas geradas em `art/sprites.ts` por PNGs com as mesmas chaves) e sons/música.
- Classes e armas do jogo original (`Attacks.java`, `Weapons.java`: espada, arco, cajado...).
- Layout em retrato para celular.
- Tradução para inglês (a maior parte do público do CrazyGames não fala português).
