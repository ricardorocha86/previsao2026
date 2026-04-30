#  🏆 Metodologia do Cálculo de Força: Copa 2026

O objetivo do modelo é transformar dados estatísticos e históricos em um único indicador — a **Força Ajustada** — que dita a probabilidade de uma seleção marcar gols e vencer partidas.

---

## 1. Cálculo da Força Resultante

A base do modelo é uma combinação linear de 6 pilares estatísticos, todos normalizados entre 0 e 1 ($x$). A **Força Resultante ($F_{res}$)** é calculada pela média ponderada das variáveis:

$$
F_{res} = \frac{(w_{FIFA} \cdot x_{FIFA}) + (w_{ELO} \cdot x_{ELO}) + (w_{Mom} \cdot x_{Mom}) + (w_{Mkt} \cdot x_{Mkt}) + (w_{Hist} \cdot x_{Hist}) + (w_{Anf} \cdot x_{Anf})}{\sum w}
$$



Onde cada $w$ representa o peso ajustado no dashboard e cada $x$ o valor normalizado da seleção naquele critério.

### Pesos Atuais e Impacto Real

Com base na sua configuração atual, a soma total dos pesos é **3.05**. Veja como cada fator contribui percentualmente para a nota final da seleção:

| Componente           | Peso ($w$) | Impacto (%) | Origem Técnica / Coluna                                                  |
|:-------------------- |:----------:|:-----------:|:------------------------------------------------------------------------ |
| **Valor de Mercado** | 1.00       | **32.8%**   | Valor agregado do elenco em Milhões de EUR (`Valor_Mercado_Milhoes_EUR`) |
| **Histórico Copas**  | 0.90       | **29.5%**   | Score ponderado de participações e melhor resultado histórico            |
| **ELO Rating**       | 0.70       | **23.0%**   | Rating competitivo atual (`ELO_Rating`) da eloratings.net                |
| **Momento**          | 0.30       | **9.8%**    | Variação do rating ELO nos últimos 12 meses (`ELO_Chg_1A`)               |
| **Anfitrião**        | 0.10       | **3.3%**    | Flag binária de vantagem para países sede (USA, MEX, CAN)                |
| **FIFA**             | 0.05       | **1.6%**    | Pontuação institucional oficial (`FIFA_Current_Points`)                  |

---

## 2. Parâmetros de Ajuste e Balanceamento

Após o cálculo base, aplicamos a transformação final que define o comportamento do simulador:

$$
\text{Força Final} = \text{Offset} + (F_{res})^\text{Elasticidade}
$$

### ⚙️ Parâmetros em Uso:

* **Elasticidade (1.15):** Age como um potenciador de elite. Valores acima de 1.00 fazem com que as pequenas diferenças no topo da tabela se tornem vantagens competitivas reais em campo.
* **Offset (0.13):** É o **parâmetro de balanceamento**. Ele regula o "gap" entre o mais forte e o mais fraco. Ao somar um valor fixo, você reduz a distância relativa entre as potências e os azarões, garantindo que nenhum time seja "nulo" e permitindo que o fator sorte (variância) opere sobre uma base mínima.
* **Média de Gols (3.00):** Define a intensidade ofensiva geral da competição.

---

## 3. Modelo Probabilístico e Correção Dixon-Coles

As probabilidades de placar são geradas via **Distribuição de Poisson**. No entanto, modelos Poisson puros tendem a subestimar ou superestimar a frequência de placares baixos (como 0-0 e 1-1) em jogos de futebol.

### Correção Dixon-Coles ($\rho = -0.13$)

Para resolver isso, aplicamos a correção de **Dixon-Coles**. Ela ajusta a probabilidade conjunta dos gols quando os placares esperados são baixos.

* **Por que -0.13?** Este valor é um ajuste empírico clássico na literatura de modelagem de futebol. Um $\rho$ negativo (neste caso -0.13) atua corrigindo a dependência entre os ataques e defesas em situações de poucos gols. 
* **Vantagem:** Ele torna o modelo muito mais realista para prever empates e resultados de 1-0 ou 0-1, que são extremamente comuns em torneios de tiro curto como a Copa do Mundo, evitando que o modelo seja "puramente matemático" e ignorando a natureza defensiva de certos confrontos.

---


