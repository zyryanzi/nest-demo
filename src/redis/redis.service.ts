import * as Redis from 'ioredis';
import * as util from 'util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { User } from '../entity/user';

class CacheKeys {
  readonly user: string = 'user:%d';
  readonly signupCode: string = 'signupcode:%s';
  readonly userToken: string = 'usertoken:%d';
}

@Injectable()
export class RedisService {
  readonly client: Redis.Redis;
  readonly cacheKeys: CacheKeys;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis(this.configService.redis);
    this.cacheKeys = new CacheKeys();
  }

  async getUser(uid) {
    const cacheKey = util.format(this.cacheKeys.user, uid);
    const userStr = await this.client.get(cacheKey);
    const user = userStr ? JSON.parse(userStr) : null;
    return user;
  }

  async setUser(user: User) {
    const cacheKey = util.format(this.cacheKeys.user, user.id);
    return await this.client.set(cacheKey, user, 'EX', 1 * 60 * 60);
  }

  async setSignupCode(phone: string, code: string) {
    const cacheKey = util.format(this.cacheKeys.signupCode, phone);
    return await this.client.set(cacheKey, code, 'EX', 10 * 60);
  }

  async getSignupCode(phone: string): Promise<string> {
    const cacheKey = util.format(this.cacheKeys.signupCode, phone);
    return await this.client.get(cacheKey);
  }

  async setUserToken(userID: number, token: string) {
    const cacheKey = util.format(this.cacheKeys.userToken, userID);
    const tokenMaxAge: number = this.configService.server.tokenMaxAge;
    return await this.client.set(cacheKey, token, 'EX', Math.floor(tokenMaxAge / 1000));
  }

  async getUserToken(userID: number) {
    const cacheKey = util.format(this.cacheKeys.userToken, userID);
    return await this.client.get(cacheKey);
  }

  async setCache(key: string, value: string, expire: number) {
    return await this.client.set(key, value, 'EX', expire);
  }

  async getCache(key: string) {
    return await this.client.get(key);
  }

  async delCache(key: string) {
    return await this.client.del(key);
  }
}