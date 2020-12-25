import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from 'http2';
import { SettingsEntity } from '../entity/settings.entity';
import { ConfigService } from '../config/config.service';
import { RedisService } from '../redis/redis.service';
import { MyLoggerService } from '../common/logger.service';
import * as Geetest from 'gt3-sdk';

@Injectable()
export class UserService {
    private geetest: Geetest;

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(SettingsEntity)
        private readonly settingsRepository: Repository<Settings>,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly logger: MyLoggerService,
    ) {}

}