// Node
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Fastify
import Fastify from 'fastify';
import RateLimit from '@fastify/rate-limit';
import Helmet from '@fastify/helmet';
import Cors from '@fastify/cors'
import Static from '@fastify/static';

/**
 * Server
 * @class
 * @description Fastify server
 * @method start
 * @returns {Promise<void>}
 * @example
 * import { Server } from './server.js';
 * new Server().start();
 */
export class Server {
  app
  port
  __filename
  __dirname

  constructor() {
    this.app = Fastify()
    this.port = process.env.PORT || 6090;
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = dirname(this.__filename);
  }
  
  #middlewares() {
    return Promise.all([
      this.app.register(RateLimit, {
        max: 100
      }),
      this.app.register(Cors),
      this.app.register(Helmet, {
        global: true,
        referrerPolicy: {
          policy: 'no-referrer'
        }
      }),
      this.app.register(Static, {
        root: resolve(this.__dirname, 'dist')
      })
    ])
  }

  async start() {
    try {
      await this.#middlewares()

      this.app.listen({ port: this.port }, (err, address) => {
        if (err) return Promise.reject(err)

        console.log(`Server is running on ${address}`)
      })
    } catch(err) {
      return console.error(err)
    }
  }
}