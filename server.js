import { dirname, resolve } from "path";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyRateLimit from "@fastify/rate-limit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = fastify();
const PORT = process.env.PORT || 6090;

app.register(fastifyStatic, {
  root: resolve(__dirname, "dist"),
  prefix: "/",
  wildcard: false,
});

app.register(fastifyRateLimit, {
  max: 300,
  timeWindow: "1 minute",
});

app.setNotFoundHandler((req, reply) => {
  reply.sendFile("index.html");
});

app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

export default app;
