import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from "@copilotkit/runtime";

import { Mastra } from "@mastra/core";
import { MastraClient } from "@mastra/client-js";
import { PgVector } from "@mastra/pg";
import { registerApiRoute } from "@mastra/core/server";
import { tabsnewsAgent } from "./agents/tabsnewsAgent";

const pgVector = new PgVector({
  connectionString: process.env.POSTGRES_CONNECTION_STRING!,
});

const serviceAdapter = new ExperimentalEmptyAdapter();

export const mastra = new Mastra({
  agents: {
    tabsnewsAgent,
  },
  vectors: {
    pgVector,
  },
  server: {
    cors: {
      origin: ["http://localhost:5173"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "x-copilotkit-runtime-client-gql-version",
      ],
      credentials: false,
    },
    apiRoutes: [
      registerApiRoute("/copilotkit", {
        method: `POST`,
        handler: async (c) => {
          const client = new MastraClient({
            baseUrl: "http://localhost:4111",
          });

          const runtime = new CopilotRuntime({
            agents: (await client.getAGUI({
              resourceId: "tabsnewsAgent",
            })) as any,
          });

          const handler = copilotRuntimeNodeHttpEndpoint({
            endpoint: "/copilotkit",
            runtime,
            serviceAdapter,
          });

          return handler.handle(c.req.raw, {});
        },
      }),
    ],
  },
});
