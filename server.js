import Fastify from 'fastify';
import RateLimit from '@fastify/rate-limit';
import Cors from '@fastify/cors';
import Helmet from '@fastify/helmet';
import Static from '@fastify/static';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify({ logger: true });

class Server {
  constructor(app) {
    this.app = app;
    this.__dirname = __dirname;
  }

  #middlewares() {
    return Promise.all([
      this.app.register(RateLimit, {
        max: 100, // Max number of requests allowed in the time window
        timeWindow: '1 minute'
      }),
      this.app.register(Cors),
      this.app.register(Helmet, {
        global: true,
        referrerPolicy: {
          policy: 'no-referrer'
        }
      }),
      this.app.register(Static, {
        root: resolve(this.__dirname, 'dist'),
        prefix: '/',
      })
    ]);
  }

  async start(PORT) {
    await this.#middlewares();
    this.app.listen({ port: PORT, host: '0.0.0.0' })
      .then((address) => console.log(`Server is running on ${address}`))
      .catch(err => {
        this.app.log.error(err);
        process.exit(1);
      });
  }
}

const server = new Server(app);
const PORT = process.env.PORT || 6090; // Use the PORT environment variable, default to 6090 if not set
server.start(PORT);
