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
import { CodeConstants, EncryptConstants, ScaleConstans } from '../constants/constants';
import * as _ from 'lodash';
import { SignUpDto } from './dto/sign-up.dto';
import { rejects } from 'assert';
import { genRandom } from '../utils/common';

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
    ) {
        this.geetest = new Geetest({
            geetest_id: this.configService.geetest.geetest_id,
            geetest_key: this.configService.geetest.geetest_key,
        });
    }

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

    /**
     * 创建
     * @param signupDto
     */
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

    /**
     * 修改密码
     * @param userID
     * @param oldPass
     * @param newPass
     */
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

    /**
     * 手机号或用户名查询
     * @param phone
     * @param username
     */
    async findByPhoneOrUsername(phone: string, username: string): Promise<User | undefined> {
        return;
    }

    /**
     * 准备极验服务配置
     */
    async prepareGeetestConf(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.geetest.register(null, (data, err) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!data.success) {
                    reject(new MyHttpException({
                        message: '极验服务异常',
                    }));
                }
                resolve(data);
            });
        });
    }

    /**
     * 校验极验验证码
     * @param geetestParams
     */
    async verifyGeetestCaptcha(geetestParams: any): Promise<boolean> {
        const self = this;
        return new Promise((resolve, reject) => {
            const data = {
                geetest_challenge: geetestParams.geetest_challenge,
                geetest_validate: geetestParams.geetest_validate,
                geetest_second: geetestParams.geetest_second,
            };
            this.geetest.validate(false, data, (success, err) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!success) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }

    /**
     * 用户信息入缓存
     * @param id
     */
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
     * 发送短信验证码
     * @param phone
     */
    async sendSmsCode(phone: number): Promise<string> {
        const code = genRandom(CodeConstants.BASIC_NUM_ARR, 4);
        // todo 调用短信服务
        return code;
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
        const salt = genRandom(CodeConstants.BASIC_ARR, 10);
        return this.encryptPassword(newPass, salt, this.configService.server.tokenSecret);
    }
}