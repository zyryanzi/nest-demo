import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

class UserScoreDef {
  readonly createArticle: number = 5;
}

export const userScore = new UserScoreDef();

export enum UserRole {
  Normal = 1,
  Leader = 2,
  Admin = 3,
  Super = 4
}

export enum UserStatus {
  Inactive = 1,
  Active = 2,
  Frozen = 3
}

export enum UserGender {
  Male = 1,
  Female = 2,
  Unknown = 3
}

export class Follower {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly avatar: string,
    public readonly date: Date,
  ) {}
}

@Entity({name: 'user'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at' })
  updatedAt: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;

  @Column('datetime', { name: 'activated_at', nullable: true, default: null })
  activatedAt: Date; // 账号激活时间

  @Column('varchar', { length: 100 })
  username: string;

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar', { length: 50, nullable: true, default: null })
  phone: string;

  @Exclude()
  @Column('varchar', { length: 100 })
  pass: string;

  @Column('int')
  role: UserRole; // 角色

  @Column('int')
  status: UserStatus; // 用户状态

  @Column('varchar', { name: 'avatar_url', length: 500 })
  avatar: string; // 头像

  @Column('tinyint')
  sex: UserGender;

  @Column('varchar', { name: 'job', length: 100 })
  job: string;

  @Column('varchar', { name: 'company', length: 100 })
  company: string;

}