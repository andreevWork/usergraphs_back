import { Injectable } from '@nestjs/common';
import { Client, Schema, Entity, Repository } from 'redis-om';

const url = `redis://${process.env.REDIS_HOST}:6379`;

@Injectable()
export class RedisService {
  private client: Client;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.client = await new Client().open(url);
    } catch (e) {
      console.error('REDIS START ERROR: ', e);
    }
  }

  async createRepository<T extends Entity>(schema: Schema<T>) {
    if (!this.client) {
      return {} as Repository<T>;
    }

    const repository = this.client.fetchRepository(schema);

    await repository.createIndex();

    return repository;
  }
}
