package Jogo;

import java.util.Scanner;

public class Attacks {
    
    Scanner input = new Scanner(System.in);
    int choice = input.nextInt();

    public int choiceAttackEspada(Defender defender) {
        System.out.println("\t>> ESCOLHA SEU ATAQUE <<");
        System.out.println("[1] ATAQUE BÁSICO");
        System.out.println("Aplica DANO equivalente a 120% da ARMA.");
        System.out.println("----------------------------------------");
        System.out.println("[2] GIRO FURIOSO (REQUER: 20 DE MANA)");
        System.out.println("Aplica DANO equivalente a 150% da ARMA.");
        System.out.println("Aplica SANGRAMENTO de 14/DANO");
        System.out.println("----------------------------------------");
        System.out.println("[3] INSTINTO SELVAGEM (REQUER: 60 DE MANA)");
        System.out.println("Aplica DANO equivalente a 185% da ARMA.");
        System.out.println("Diminui a ARMADURA do Inimigo em 3/PONTOS.");
        return choice;
    }
    
    public int displayAttackArco() {
        System.out.println("\t>> ESCOLHA SEU ATAQUE <<");
        System.out.println("[1] ATAQUE BÁSICO");
        System.out.println("Aplica DANO equivalente a 130% da ARMA.");
        System.out.println("----------------------------------------");
        System.out.println("[2] FLECHA MÁGICA (REQUER: 20 DE MANA)");
        System.out.println("Aplica DANO equivalente a 180% da ARMA.");
        System.out.println("Diminui a ARMADURA do Inimigo em 2/PONTOS");
        System.out.println("----------------------------------------");
        System.out.println("[3] SARAIVADA (REQUER: 60 DE MANA)");
        System.out.println("Dispara Flechas, causando DANO equivalente a 125% da ARMA");
        System.out.println("Aplica DANO de Fogo no Inimigo, causando 21/DANO.");
        System.out.println("ADICIONAL: Esta habilidade causa + 155% de DANO");
        return choice;
    }

    public int displayAttackCajado() {
        System.out.println("\t>> ESCOLHA SEU ATAQUE <<");
        System.out.println("[1] ATAQUE BÁSICO");
        System.out.println("Aplica DANO equivalente a 125% da ARMA.");
        System.out.println("----------------------------------------");
        System.out.println("[2] AURA CURATIVA (REQUER: 20 DE MANA)");
        System.out.println("Aplica DANO equivalente a 80% da ARMA.");
        System.out.println("Diminui a ARMADURA do Inimigo em 2/PONTOS");
        System.out.println("RECUPERAÇÃO DE VIDA: 60/PONTOS");
        System.out.println("----------------------------------------");
        System.out.println("[3] EXPLOSÃO DE CURA (REQUER: 60 DE MANA)");
        System.out.println("Aplica DANO equivalente a 120% da ARMA.");
        System.out.println("RECUPERAÇÃO DE VIDA: 120/PONTOS");
        System.out.println("ADICIONAL: Devolve 15% da MANA gasta.");
        return choice;
    }

    // >> ARMAS <<
    // ESPADA - ARCO - CAJADO - MARTELO - LANÇA - BESTA - ADAGA - MAÇA - MACHADO
    // 2 TIPOS DE CADA NO MOMENTO
    // ATRIBUTOS DAS ARMAS -> DANO, VELOCIDADE DE ATAQUE,
    // (CHANCE DE CRÍTICO E DANO CRÍTICO)

    // >> ACESSORIOS <<
    // >> AUMENTAR EXP - AUMENTAR OURO - ADQUIRIR ABSORÇÃO -


    // >> ARMADURAS <<
    // ARMADURA LEVE -> ARMADURA ACOLCHOADA, ARMADURA DE COURO
    // ARMADURA MÉDIA -> ARMADURA DE BRONZE, ARMADURA
    // ARMADURA PESADA -> ARMADURA DE PLACA, ARMADURA DE FERRO

    // ATRIBUTOS DAS ARMADURAS -> VIDA, ARMADURA, ABSORÇÃO, (BÔNUS DE DANO)
    // (QUANTO MAIS PESADA, MAIS ABSORÇÃO, VIDA, ARMADURA)
    // (QUANTO MAIS LEVE, MAIS BÔNUS DE DANO)


}
