import "dotenv/config";

import FirecrawlApp from "@mendable/firecrawl-js";
import { MDocument } from "@mastra/rag";
import { PgVector } from "@mastra/pg";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

const urls = [
  "https://www.tabnews.com.br/asyncGenerator/dev-cansado-lanca-site-onde-voce-pode-doar-r1-pra-ele-nao-ter-que-vender-trufa-no-farol",
  "https://www.tabnews.com.br/oyvesmariano/pitch-como-lancei-a-plataforma-que-vai-desbancar-a-product-hunt-no-brasil",
  "https://www.tabnews.com.br/tintinthedev/como-usar-o-reddit-para-vender-seu-saas",
  "https://www.tabnews.com.br/acgfbr/tentando-empreender-com-edicao-de-video",
  "https://www.tabnews.com.br/DavidBarbieri/me-ajudem-problema-ao-criar-um-programa-simples-em-c",
  "https://www.tabnews.com.br/Escudo/programar-por-amor-te-mantem-pobre",
  "https://www.tabnews.com.br/DevTiltado/preciso-de-dicas-para-realocacao-no-mercado",
  "https://www.tabnews.com.br/NewsletterOficial/campanha-no-tiktok-utiliza-videos-para-disseminar-malware",
  "https://www.tabnews.com.br/fern/git-add-git-commit-e-git-push-nao-obrigado",
  "https://www.tabnews.com.br/thlmenezes/diga-adeus-ao-gmail-com-configure-seu-email-profissional-passo-a-passo",
  "https://www.tabnews.com.br/cesarolvr/pitch-que-tal-uma-biblioteca-de-animacao-que-funcionara-em-seu-html-puro-sem-react-vue-angular-ou-qualquer-outra-coisa",
  "https://www.tabnews.com.br/opatrickmns/como-hackei-o-facebook-recompensa-de-3000-e-porque-llm-gera-codigo-inseguro",
  "https://www.tabnews.com.br/dudufidelis/criei-um-jogo-mobile-android-mas-ninguem-jogou",
  "https://www.tabnews.com.br/ForseeR/desabafo-rocketseat-e-muito-boa-porem",
  "https://www.tabnews.com.br/paulocoutinho/audio-studio-ai-transforme-textos-em-vozes-profissionais-100-por-cento-local-sem-custos-e-sem-limites",
  "https://www.tabnews.com.br/NewsletterOficial/gemini-por-1-420-reais-traducao-no-meet-e-outras-novidades-do-google-i-o-2025",
  "https://www.tabnews.com.br/theProgrammerWolf/lancei-meu-primeiro-micro-saas-o-polotrip",
  "https://www.tabnews.com.br/SoloYyax/quanto-devo-cobrar-por-esse-projeto",
  "https://www.tabnews.com.br/rrg92/live-novidades-do-sql-server-2025-na-pratica",
  "https://www.tabnews.com.br/k1ra/cansei-de-expor-meus-dados-ao-compartilhar-meu-pix-criei-um-site-pra-criar-chaves-customizadas",
  "https://www.tabnews.com.br/mariocarvalhobr/ajuda-curso-completo-front-end-do-basico-ao-avancado-2025-html5-css3-boostrap-5-com-nodejs-e-mysql",
  "https://www.tabnews.com.br/opatrickmns/sim-eu-precisei-criar-uma-ferramenta-em-c",
  "https://www.tabnews.com.br/nozkel/o-habito-de-ler-e-como-isso-afeta-sua-vida-positivamente",
  "https://www.tabnews.com.br/JoaoFreire/automatizei-a-adaptacao-de-curriculos-para-a-vaga-que-quiser",
  "https://www.tabnews.com.br/tintinthedev/so-depois-de-botar-a-cara-sem-medo-foi-que-consegui-vender-meu-saas",
  "https://www.tabnews.com.br/weberfernando/o-que-voces-acham-de-um-canva-open-source-e-100-por-cento-gratuito",
  "https://www.tabnews.com.br/MisterF/server-sent-events-sse-voce-conhece",
  "https://www.tabnews.com.br/HenriqueMena/duvida-como-programadores-experientes-conseguem-ser-tao-ativos-em-projetos-open-source-e-foruns",
  "https://www.tabnews.com.br/Oletros/planejamento-voce-esta-construindo-seus-sonhos-ou-apenas-apagando-incendios",
  "https://www.tabnews.com.br/moacirmoda/uma-maquina-de-imprimir-dinheiro",
];

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});

const pgVector = new PgVector({
  connectionString: process.env.POSTGRES_CONNECTION_STRING!,
});

await pgVector.createIndex({
  indexName: "tabNews",
  dimension: 1536,
});

for (const url of urls) {
  const scrapeResult = await firecrawl.scrapeUrl(url, {
    formats: ["markdown"],
    onlyMainContent: true,
  });

  if (scrapeResult.success) {
    if (scrapeResult.markdown && scrapeResult.markdown !== "") {
      const document = MDocument.fromMarkdown(scrapeResult.markdown);

      const chunks = await document.chunk({
        strategy: "markdown",
        size: 512,
        overlap: 51,
      });

      const { embeddings } = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: chunks.map((chunk) => chunk.text),
      });

      await pgVector.upsert({
        indexName: "tabNews",
        vectors: embeddings,
        metadata: chunks.map((chunk) => ({
          text: chunk.text,
          source: url,
        })),
      });

      console.log(`✅ URL ${url} processada com sucesso!`);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    }
  }
}
