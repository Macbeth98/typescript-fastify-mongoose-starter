import { Routes } from '@interfaces/routes.interface';
import { FastifyInstance, RouteOptions } from 'fastify';
import UserController from '@modules/user/user.controller';

import { GetUserSchema } from '@modules/user/user.schema';

class UserRoute implements Routes {
  public path = '/user';

  public initializeRoutes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
    const userController = new UserController(fastify);

    fastify.route({
      method: 'get',
      url: this.path,
      schema: GetUserSchema,
      preHandler: fastify.authenticateUser,
      handler: userController.getUser
    });
    done();
  }
}

export default UserRoute;
