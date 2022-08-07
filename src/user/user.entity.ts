import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Entity as EntityRedis, Schema } from 'redis-om';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;
}

export class UserRedis extends EntityRedis {
  readonly name: string;
  readonly id: string;
}

export const UserSchema = new Schema(UserRedis, {
  name: { type: 'string' },
  id: { type: 'number' },
})
