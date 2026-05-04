# Previsão Esportiva

Site público do projeto Previsão Esportiva para consulta de probabilidades, metodologia, produção científica, repercussão na mídia e equipe.

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- KaTeX para fórmulas matemáticas
- Lucide React para ícones

## Como Rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o servidor local:
   ```bash
   npm run dev
   ```
3. Gere o build de produção:
   ```bash
   npm run build
   ```
4. Visualize o build:
   ```bash
   npm run preview
   ```

## Organização Dos Dados

- `data/worldCupTeams.ts`: seleções usadas em comparações e metadados esportivos.
- `data/researchers.ts`: integrantes do projeto.
- `data/publications.ts`: publicações acadêmicas.
- `data/mediaMentions.ts`: reportagens e citações na mídia.
- `assets/*.json`: dados de simulação e confrontos da Copa 2026.
- `public/assets`: arquivos públicos servidos diretamente em `/assets`.

O app não depende mais de API key no frontend.
