export class UserConstants {
    static readonly USERNAME_MIN_LENGTH: number = 4;
    static readonly USERNAME_MAX_LENGTH: number = 16;
    static readonly PASSWORD_MIN_LENGTH: number = 6;
    static readonly PASSWORD_MAX_LENGTH: number = 20;
    static readonly JOB_MIN_LENGTH: number = 0;
    static readonly JOB_MAX_LENGTH: number = 100;
    static readonly COMPANY_MIN_LENGTH: number = 0;
    static readonly COMPANY_MAX_LENGTH: number = 100;
    static readonly INTRODUCE_MIN_LENGTH: number = 0;
    static readonly INTRODUCE_MAX_LENGTH: number = 100;
    static readonly PERSONAL_HOMEPAGE_MIN_LENGTH: number = 0;
    static readonly PERSONAL_HOMEPAGE__MAX_LENGTH: number = 100;
    static readonly CAPTCHA_LENGTH: number = 6;
}

export class EncryptConstants {
    static readonly MD5: any = 'md5';
    static readonly BASE64: any = 'base64';
    static readonly BASIC_ARR: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
}

export class ScaleConstans {
    static readonly HEX: any = 'hex';
    static readonly BINARY: any = 'binary';
}

export class EncodeConstans {
    static readonly UTF8: any = 'utf-8';
}