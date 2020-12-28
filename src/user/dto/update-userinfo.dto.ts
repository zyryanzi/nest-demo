import { IsString, IsUrl, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { ErrorCode } from '../../constants/error';
import { UserConstants } from '../../constants/constants';

export class UpdateUserinfoDto {
    // 传了 username 字段的话，才对 username 进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.username !== 'undefined';
    })
    @MinLength(UserConstants.USERNAME_MIN_LENGTH, {
        message: '用户名最少为 $constraint1 个字符',
    })
    @MaxLength(UserConstants.USERNAME_MAX_LENGTH, {
        message: '用户名不能超过 $constraint1 个字符',
    })
    @IsString({
        message: ErrorCode.ParamsError.MESSAGE,
        context: {
            errorCode: ErrorCode.ParamsError.CODE,
        },
    })
    readonly username: string;

    @ValidateIf(obj => {
        return obj && typeof obj.job !== 'undefined';
    })
    @MinLength(UserConstants.JOB_MIN_LENGTH, {
        message: '职位最少为 $constraint1 个字符',
    })
    @MaxLength(UserConstants.JOB_MAX_LENGTH, {
        message: '职位不能超过 $constraint1 个字符',
    })
    @IsString({
        message: ErrorCode.ParamsError.MESSAGE,
        context: {
            errorCode: ErrorCode.ParamsError.CODE,
        },
    })
    readonly job: string;

    @ValidateIf(obj => {
        return obj && typeof obj.company !== 'undefined';
    })
    @MinLength(UserConstants.COMPANY_MIN_LENGTH, {
        message: '公司最少为 $constraint1 个字符',
    })
    @MaxLength(UserConstants.COMPANY_MAX_LENGTH, {
        message: '公司不能超过 $constraint1 个字符',
    })
    @IsString({
        message: ErrorCode.ParamsError.MESSAGE,
        context: {
            errorCode: ErrorCode.ParamsError.CODE,
        },
    })
    readonly company: string;

    @ValidateIf(obj => {
        return obj && typeof obj.avatar !== 'undefined';
    })
    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly avatar: string;
}