import { Agent } from "@mastra/core";
import { createVectorQueryTool } from "@mastra/rag";
import { openai } from "@ai-sdk/openai";

const tabsnewsQueryTool = createVectorQueryTool({
  vectorStoreName: "pgVector",
  indexName: "tabnews",
  model: openai.embedding("text-embedding-3-small"),
});

export const tabsnewsAgent = new Agent({
  name: "TabNews Agent",
  instructions: `Você é um assistente especializado em artigos no TabNews (tabnews.com.br).
    Use a ferramenta de consulta vetorial fornecida para encontrar informações relevantes em sua base de conhecimento,
    e forneça respostas precisas e bem fundamentadas com base no conteúdo recuperado.
    Concentre-se no conteúdo específico disponível na ferramenta e reconheça se não conseguir encontrar informações suficientes para responder a uma pergunta.
    Baseie suas respostas apenas no conteúdo fornecido, não em conhecimento geral.`,
  model: openai("gpt-4o-mini"),
  tools: {
    tabsnewsQueryTool,
  },
});
