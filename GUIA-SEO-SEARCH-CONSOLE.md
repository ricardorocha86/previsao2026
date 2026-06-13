# Guia de SEO — Google Search Console e indexação

Guia prático para colocar o site `previsaoesportiva.com.br` no índice do Google.
Faça na ordem. Os 3 primeiros passos são os que mais importam.

---

## 0. Antes de tudo: o site já está indexado?

No Google, pesquise:

```
site:previsaoesportiva.com.br
```

- **Aparecem páginas** → o site já está indexado; o problema é só ranqueamento
  (autoridade/tempo, ver seção "Expectativa realista").
- **Não aparece nada** → o site ainda não foi indexado. É o estado mais provável
  para um site novo. Os passos abaixo resolvem isso.

---

## 1. Cadastrar o domínio no Google Search Console (GSC)

1. Acesse https://search.google.com/search-console e entre com a conta Google do
   projeto (`equipeprevisaoesportiva@gmail.com` ou a conta de quem administra).
2. Em "Adicionar propriedade", escolha **"Prefixo do URL"** e informe:
   `https://www.previsaoesportiva.com.br`
3. Verifique a propriedade por um destes métodos:

   **Método A — tag HTML (já preparado no código):**
   - O GSC mostra uma `<meta name="google-site-verification" content="...">`.
   - Copie o valor do `content` e cole em `Website/index.html`, descomentando a
     linha que já está lá (procure por `google-site-verification`).
   - Faça o deploy na Vercel e clique em **"Verificar"** no GSC.

   **Método B — arquivo HTML (não mexe no código):**
   - Baixe o arquivo `googXXXXXXXX.html` que o GSC oferece.
   - Coloque-o em `Website/public/` (o Vite publica tudo dessa pasta na raiz).
   - Faça o deploy e clique em **"Verificar"**.

   > Dica: vale a pena também adicionar a propriedade do tipo **"Domínio"**
   > (verificação por DNS) — cobre www, sem-www, http e https de uma vez. Exige
   > criar um registro TXT no painel do registrador do domínio.

---

## 2. Enviar o sitemap

1. No GSC, menu lateral → **Sitemaps**.
2. Em "Adicionar novo sitemap", digite: `sitemap.xml` e clique em **Enviar**.
   (URL completa: `https://www.previsaoesportiva.com.br/sitemap.xml`)
3. O status deve ficar "Êxito". O sitemap já lista as 10 rotas do site.

---

## 3. Forçar a indexação das páginas principais

Para cada URL importante (comece por estas), use a **"Inspeção de URL"** (barra de
busca no topo do GSC) → cole a URL → **"Solicitar indexação"**:

- `https://www.previsaoesportiva.com.br/`
- `https://www.previsaoesportiva.com.br/copa-2026`
- `https://www.previsaoesportiva.com.br/caminho-do-hexa`
- `https://www.previsaoesportiva.com.br/bolao`
- `https://www.previsaoesportiva.com.br/simulador`

Na Inspeção de URL, use também **"Testar URL ativo" → "Ver página rastreada" →
"HTML"** para confirmar que o Google está vendo o conteúdo (título, H1 e texto).
Depois das mudanças de prerender, o HTML já deve conter o conteúdo da página
mesmo antes de executar o JavaScript.

---

## 4. Acompanhar (volte em ~1–2 semanas)

- **Cobertura / Páginas**: quantas URLs foram indexadas e os erros encontrados.
- **Desempenho**: quais buscas já trazem impressões e cliques. É aqui que você
  descobre por quais termos o site começa a aparecer.

---

## Expectativa realista (importante)

- **"previsão esportiva" é um termo genérico e disputado.** Um site novo, com
  autoridade de domínio perto de zero, **não vai ranquear** para esse termo de
  cabeça nos primeiros meses — isso é normal, não é defeito.
- **Mire em buscas de cauda longa** que casam com o conteúdo e têm menos
  concorrência: "probabilidade Brasil campeão Copa 2026", "chances de cada
  seleção Copa do Mundo 2026", "simulador Copa 2026", "bolão Copa do Mundo 2026".
- **Backlinks da imprensa são sua maior alavanca.** Cada matéria que **linkar**
  o domínio (não só citar o nome) vale mais que meses de ajuste técnico. No
  lançamento, peça aos jornalistas para incluir o link.

---

## O que já foi feito no código (não precisa refazer)

- **Prerender estático por rota** (`Website/scripts/prerender.mjs`, roda no
  `npm run build`): cada rota agora é servida com HTML real — título, descrição,
  canonical e Open Graph próprios + conteúdo textual indexável + links internos.
  Resolve a limitação do SPA, que antes entregava página vazia ao robô.
- **Meta tags por rota também na navegação client-side** (`App.tsx`): canonical e
  OG passam a apontar para a URL correta, não mais sempre para a home.
- **Sitemap** corrigido e gerado automaticamente a partir da lista de rotas.
- **`vercel.json`**: `cleanUrls` + `trailingSlash` para servir os arquivos por
  rota corretamente.

Após qualquer mudança, basta `npm run build` e deploy na Vercel.
