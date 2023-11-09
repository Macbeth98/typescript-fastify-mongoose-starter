import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { LoginUser } from '@modules/auth/auth.interface';

import AuthService from '@modules/auth/auth.service';

class AuthController {
  private authService: AuthService;

  constructor(fastify: FastifyInstance) {
    this.authService = new AuthService(fastify);
  }

  public login = async (req: FastifyRequest<{ Body: LoginUser }>, reply: FastifyReply) => {
    const { email, password } = req.body;

    const data = await this.authService.LoginUser({ email, password }, reply);

    return { data, message: 'login' };
  };
}

export default AuthController;
