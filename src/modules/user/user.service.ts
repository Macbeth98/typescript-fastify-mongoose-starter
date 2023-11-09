import { hash } from 'bcrypt';

import { CreateUser, GetUser } from '@modules/user/user.interface';

import { Conflict, NotFound } from '@exceptions/error';
import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';

class UserService {
  private db = mongoose.connection.db;

  private saltRounds = 10;

  constructor(fastify: FastifyInstance) {
    this.db = fastify.mongo;
  }

  public async createUser(createData: CreateUser) {
    const checkUserExists = await this.db.collection('users').findOne({ email: createData.email });

    if (checkUserExists) {
      throw new Conflict('User already exists');
    }

    const hashedPassword = await hash(createData.password, this.saltRounds);

    const user = await this.db.collection('users').insertOne({
      email: createData.email,
      password: hashedPassword
    });

    return user;
  }

  public async getUser(getUserData: GetUser) {
    const findUser = await this.db.collection('users').findOne({ email: getUserData.email });

    if (!findUser) {
      throw new NotFound('User not found');
    }

    return findUser;
  }
}

export default UserService;
