import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PredictionResult, NewsItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured odds output
const predictionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    homeWinProbability: { type: Type.NUMBER, description: "Percentage probability (0-100) of Home Team winning" },
    drawProbability: { type: Type.NUMBER, description: "Percentage probability (0-100) of a Draw" },
    awayWinProbability: { type: Type.NUMBER, description: "Percentage probability (0-100) of Away Team winning" },
    predictedScore: { type: Type.STRING, description: "Most likely scoreline, e.g., '2-1'" },
    reasoning: { type: Type.STRING, description: "Scientific explanation based on team form, tactical analysis, and historical data." },
    keyFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 key tactical/statistical factors influencing this result"
    }
  },
  required: ["homeWinProbability", "drawProbability", "awayWinProbability", "predictedScore", "reasoning", "keyFactors"]
};

export const calculateOdds = async (teamA: string, teamB: string): Promise<PredictionResult> => {
  try {
    const prompt = `
      You are a Senior Sports Data Scientist specializing in predictive modeling for the 2026 World Cup.
      
      Task: Simulate a match between ${teamA} and ${teamB} using a rigorous statistical approach.
      
      Methodology to apply:
      1. Poisson Distribution for goal expectancy.
      2. Elo Rating adjustments based on recent confederation performance.
      3. Tactical fit analysis (e.g., High press vs Low block).
      4. World Cup 2026 context (Neutral venues in North America).

      Analyze the current squads, recent form, and historical head-to-head.
      
      Output: Provide the probabilities and reasoning strictly in JSON format matching the schema.
      Keep the "reasoning" concise, professional, and academic in tone (Portuguese language).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
        temperature: 0.2, // Low temperature for high analytical consistency
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from model");
    return JSON.parse(text) as PredictionResult;

  } catch (error) {
    console.error("Error calculating odds:", error);
    // Fallback for demo/error states
    return {
      homeWinProbability: 33,
      drawProbability: 34,
      awayWinProbability: 33,
      predictedScore: "1-1",
      reasoning: "Não foi possível conectar ao servidor de inferência estatística. Exibindo probabilidades baseadas em entropia máxima (incerteza total).",
      keyFactors: ["Incerteza do Modelo", "Dados Insuficientes", "Alta Variância"]
    };
  }
};

export const getComparativeAnalysis = async (teamA: string, teamB: string): Promise<string> => {
  try {
    const prompt = `
      Pesquise no Google as últimas notícias, polêmicas e atualizações (últimos 6 meses) sobre as seleções de futebol: ${teamA} e ${teamB}.

      Foco da investigação:
      1. Crises internas, polêmicas de vestiário ou problemas com a federação.
      2. Situação atual do técnico (risco de demissão, críticas, novidades).
      3. Lesões recentes de jogadores estrelas ou cortes.
      4. Desempenho nos últimos jogos oficiais.

      Com base no que encontrar, escreva um "Relatório de Inteligência" comparativo para um possível duelo.
      Destaque como essas polêmicas ou fatos recentes impactariam o psicológico e tático do jogo.
      
      Tom de voz: Jornalista investigativo esportivo, sério e direto.
      Idioma: Português.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable grounding to find recent controversies
      }
    });

    return response.text || "Análise indisponível no momento.";
  } catch (error) {
    console.error("Error fetching comparison:", error);
    return "Não foi possível gerar a análise com dados em tempo real. Tente novamente mais tarde.";
  }
};

export const fetchWorldCupNews = async (): Promise<NewsItem[]> => {
  try {
    // Specifically targeting the user's request about the Draw and Restrictions
    const prompt = `
      Search for the latest official news regarding the FIFA World Cup 2026.
      Focus specifically on:
      1. The Group Stage Draw mechanics and dates.
      2. FIFA's new restrictions for the draw.
      3. Host city logistics (USA, Mexico, Canada).
      
      Return a summary of the top 4 most relevant and factual updates found.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const newsItems: NewsItem[] = [];

    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
          // Clean up titles if they are too long
          const cleanTitle = chunk.web.title.replace(' - YouTube', '').split('|')[0].trim();
          newsItems.push({
            title: cleanTitle,
            url: chunk.web.uri,
            source: new URL(chunk.web.uri).hostname.replace('www.', ''),
            snippet: "Dados verificados pelo Google Search Grounding."
          });
        }
      });
    }

    // Deduplicate based on URL and limit to 4
    const uniqueNews = Array.from(new Map(newsItems.map(item => [item.url, item])).values()).slice(0, 4);
    
    return uniqueNews;

  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};