import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRedis, UserSchema } from './user.entity';
import { UserSignupDto } from './user.dto';
import { PasswordService } from './auth/password.service';
import { RedisService } from '../common/redis/redis.service';
import { EntityData, Repository as RepositoryRedis } from 'redis-om';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private userRedisRepository: RepositoryRedis<UserRedis>;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private passwordService: PasswordService,
    private redisService: RedisService
  ) {
    this.redisService.createRepository(UserSchema)
      .then((repository) => {
        this.userRedisRepository = repository;
      });
  }

  async setUserToRedis(user: EntityData): Promise<string> {
    const userRedis = await this.userRedisRepository.createAndSave(user);

    await this.userRedisRepository.expire(userRedis.entityId, 60 * 60);

    return userRedis.entityId;
  }

  async getUserFromRedis(entityId: string): Promise<UserRedis> {
    return this.userRedisRepository.fetch(entityId);
  }

  createUser(body: UserSignupDto): Promise<User> {
    const user = new User();

    user.name = body.name;
    user.password = this.passwordService.createPassword(body.password);

    return this.userRepository.save(user);
  }

  async validateAndGetUser(name: string, password: string): Promise<User | null> {
    const user = await this.findByName(name) ;

    if (!user) {
      return null;
    }

    return this.passwordService.checkPassword(password, user.password) ? user : null;
  }

  findByName(name: string): Promise<User | null> {
    return this.userRepository.findOneBy({ name });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
