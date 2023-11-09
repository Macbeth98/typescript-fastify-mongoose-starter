import { FastifyInstance, FastifyRequest } from 'fastify';

import { CreateUser, GetUser } from '@modules/user/user.interface';

import UserService from '@modules/user/user.service';

class UserController {
  public userService: UserService;

  constructor(fastify: FastifyInstance) {
    this.userService = new UserService(fastify);
  }

  public createUser = async (req: FastifyRequest<{ Body: CreateUser }>) => {
    const { email, password } = req.body;

    const data = await this.userService.createUser({ email, password });

    return { data, message: 'user created' };
  };

  public getUser = async (req: FastifyRequest) => {
    const { email } = req.user as GetUser;

    const data = await this.userService.getUser({ email });

    return { data, message: 'get user' };
  };
}

export default UserController;
