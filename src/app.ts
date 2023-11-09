import Fastify, { FastifyError, FastifyInstance } from 'fastify';
import ajvErrors from 'ajv-errors';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyJwt from '@fastify/jwt';
import { envOptions } from '@config';
import fastifyEnv from '@fastify/env';

import { initializeRoutes } from '@plugins/initializeRoute';
import { authentication } from '@plugins/authentication';
import { initSwagger } from '@plugins/swagger';
import mongodbPlugin from '@plugins/mongodb';

import { schemaErrorFormatter } from '@utils/schemaErrorFormatter';

class App {
  public app: FastifyInstance;

  constructor() {
    this.app = Fastify({
      schemaErrorFormatter,
      ajv: {
        customOptions: {
          coerceTypes: false,
          allErrors: true
        },
        plugins: [ajvErrors]
      },
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            translateTime: true,
            colorize: true
          }
        }
      }
    }).withTypeProvider<TypeBoxTypeProvider>();
  }

  public async listen() {
    try {
      await this.init();

      await this.app.listen({ port: this.app.config.PORT });
    } catch (err) {
      this.app.log.error(err);
      process.exit(1);
    }
  }

  public getServer() {
    return this.app;
  }

  private async init() {
    await this.initializePlugins();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializePlugins() {
    await this.app.register(fastifyEnv, envOptions);
    await this.app.register(mongodbPlugin, { uri: this.app.config.DATABASE_URL });
    this.app.register(fastifyCors, { origin: true });
    this.app.register(fastifyHelmet);
    this.app.register(fastifyCompress);
    this.app.register(fastifyJwt, { secret: this.app.config.SECRET_KEY });
    this.app.register(authentication);
    this.app.register(initSwagger);
  }

  private initializeRoutes() {
    this.app.register(initializeRoutes);
  }

  private initializeErrorHandling() {
    this.app.setErrorHandler((error: FastifyError, request, reply) => {
      const status: number = error.statusCode ?? 500;
      const message: string = status === 500 ? 'Something went wrong' : error.message ?? 'Something went wrong';

      this.app.log.error(`[${request.method}] ${request.url} >> StatusCode:: ${status}, Message:: ${message}`);

      return reply.status(status).send({ error: true, message });
    });
  }
}

export default App;
