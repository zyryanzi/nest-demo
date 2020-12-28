import { Injectable } from '@nestjs/common';
import { User, UserGender, UserRole, UserStatus } from '../entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from '../entity/settings.entity';
import { ConfigService } from '../config/config.service';
import { RedisService } from '../redis/redis.service';
import { MyLoggerService } from '../common/logger.service';
import * as Geetest from 'gt3-sdk';
import { ErrorCode } from '../constants/error';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { MyHttpException } from '../core/exception/MyHttpException';
import * as crypto from 'crypto';
import { EncryptConstants, ScaleConstans } from '../constants/constants';
import * as _ from 'lodash';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class UserService {
    private geetest: Geetest;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Settings)
        private readonly settingsRepository: Repository<Settings>,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly logger: MyLoggerService,
    ) {}

    /**
     * 取得用户公开基本信息
     */
    async basicInfo(id: number): Promise<User | undefined> {
        const user: User | undefined = await this.userRepository.findOne({
            select: ['id', 'createdAt', 'username', 'role', 'avatar', 'sex'] as any,
            where: { id },
        });
        return user;
    }

    /**
     * 仅可更新低于当前用户角色的对象
     * @param userID
     * @param status
     * @param operatorRole
     */
    async updateStatus(userID: number, status: UserStatus, operatorRole: UserRole): Promise<UpdateResult> {
        return await this.userRepository.createQueryBuilder()
            .update()
            .set({ status })
            .where('id = :id', { id: userID })
            .andWhere('role < :role', { role: operatorRole })
            .execute();
    }

    /**
     * 更新用户信息（头像，职位，公司）
     * @param userID
     * @param updateUserInfoDto
     */
    async updateInfo(userID: number, updateUserInfoDto: UpdateUserinfoDto): Promise<UpdateResult> {
        const updateData: any = {};
        if (typeof updateUserInfoDto.avatar !== 'undefined') {
            updateData.avatarURL = updateUserInfoDto.avatar;
        }
        if (typeof updateUserInfoDto.job !== 'undefined') {
            updateData.job = updateUserInfoDto.job;
        }
        if (typeof updateUserInfoDto.company !== 'undefined') {
            updateData.company = updateUserInfoDto.company;
        }
        if (typeof updateUserInfoDto.username !== 'undefined') {
            updateData.username = updateUserInfoDto.username;
            const theUser: User = await this.userRepository.findOne({
                select: ['id'],
                where: { username: updateData.username },
            });
            if (theUser) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: `已存在用户名为 ${updateData.username} 的用户`,
                });
            }
        }
        return await this.userRepository.update({
            id: userID,
        }, updateData);
    }

    async create(signupDto: SignUpDto): Promise<User> {
        const newUser = new User();
        newUser.createdAt = new Date();
        newUser.updatedAt = newUser.createdAt;
        newUser.activatedAt = newUser.createdAt;
        newUser.phone = signupDto.phone;
        newUser.username = signupDto.username.replace(/\s+/g, ''); // 用户名中不能有空格
        newUser.pass = this.generateHashPass(signupDto.pass);
        newUser.role = UserRole.Normal;
        newUser.status = UserStatus.Active;
        newUser.sex = UserGender.Unknown;
        newUser.avatar = `${this.configService.static.imgPath}/avatar.jpg`;
        return await this.userRepository.save(newUser);
    }

    async updatePass(userID: number, oldPass: string, newPass: string): Promise<UpdateResult> {
        const user: User = await this.userRepository.findOne({
            select: ['pass'],
            where: { id: userID },
        });
        if (!user || !this.verifyPass(oldPass, user.pass)) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '旧密码不正确',
            });
        }
        return await this.userRepository.update({
            id: userID,
        }, {
            pass: this.generateHashPass(newPass),
        });
    }

    /**
     * 删除
     */
    async detail(id: number): Promise<User> {
        const user: User = await this.userRepository.findOne({
            select: ['id', 'status', 'createdAt', 'username', 'articleCount', 'collectionCount', 'role', 'avatar',
                'sex', 'job', 'company'] as any,
            where: { id },
        });
        return user;
    }

    async getUser(id: any): Promise<User> {
        this.logger.info({
            data: {
                thecodeline: 'this.redisService.getUser nvnsiwpwo ' + id,
            },
        });
        let user: User = await this.redisService.getUser(id);
        this.logger.info({
            data: {
                thecodeline: 'user is null ? ' + !user,
            },
        });
        if (!user) {
            this.logger.info({
                data: {
                    thecodeline: 'this.userRepository.findOne irueghahs ' + id,
                },
            });
            try {
                user = await this.userRepository.findOne({
                    select: ['id', 'status', 'createdAt', 'username', 'articleCount', 'collectionCount', 'role', 'avatar',
                        'sex', 'job', 'company'] as any,
                    where: { id },
                });
            } catch (e) {
                this.logger.error({
                    data: {
                        errorCode: ErrorCode.NotFound.CODE,
                        message: [e.message, e.stack].join('\n'),
                    },
                });
                throw e;
            }

            this.logger.info({
                data: {
                    thecodeline: 'this.redisService.setUser m97hejiriw',
                },
            });
            await this.redisService.setUser(user);
        }
        this.logger.info({
            data: {
                thecodeline: '<<<=== this.userService.getUser done irir89',
            },
        });

        return user;
    }

    async findOne(user: User) {
        return;
    }

    /**
     * 校验密码
     * @param oldPass
     * @param hashedPass
     */
    private verifyPass(oldPass: string, hashedPass: string) {
        if (!oldPass || !hashedPass) {
            return false;
        }
        const salt = hashedPass.substr(0, 10);
        return this.encryptPassword(oldPass, salt, this.configService.server.passSalt) === hashedPass;
    }

    /**
     * 生成密码
     * @param oldPass
     * @param salt
     * @param configSalt
     */
    private encryptPassword(oldPass: string, salt: string, configSalt: string) {
        const m1 = crypto.createHash(EncryptConstants.MD5);
        const pass = m1.update(oldPass).digest(ScaleConstans.HEX);
        let hash = salt + pass + configSalt;
        const m2 = crypto.createHash(EncryptConstants.MD5);
        hash = salt + m2.update(hash).digest(ScaleConstans.HEX);
        return hash;
    }

    /**
     * 生成salt
     * @param newPass
     */
    private generateHashPass(newPass: string): string {
        let codeArr = _.shuffle(EncryptConstants.BASIC_ARR);
        codeArr = codeArr.slice(0, 10);
        const salt = codeArr.join('');
        return this.encryptPassword(newPass, salt, this.configService.server.tokenSecret);
    }
}