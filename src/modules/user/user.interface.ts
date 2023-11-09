import { Static } from '@fastify/type-provider-typebox';

import { CreateUserBody } from '@modules/user/user.schema';

export type CreateUser = Static<typeof CreateUserBody>;

export interface GetUser {
  email: string;
}
