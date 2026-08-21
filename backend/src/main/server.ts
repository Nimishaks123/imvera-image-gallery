import { env } from "../common/config/env.js";
import { connectDatabase } from "../infrastructure/database/connection.js";
import { buildDependencies } from "./di.js";
import { createApp } from "./app.js";

async function start(): Promise<void> {
  await connectDatabase(env.mongoUri);
  console.log("Connected to MongoDB");

  const dependencies = buildDependencies();
  const app = createApp(dependencies);

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

start().catch((err: unknown) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
