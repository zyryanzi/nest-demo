class CodeAndMsg {
  CODE: number;
  MESSAGE: string;
}

export class ErrorCode {
  static readonly SUCCESS: CodeAndMsg = { CODE: 0, MESSAGE: 'success' };
  static readonly ERROR: CodeAndMsg = { CODE: 1, MESSAGE: 'fail' };
  static readonly ParamsError: CodeAndMsg = { CODE: 2, MESSAGE: '参数错误' };

  static readonly Forbidden: CodeAndMsg = {
    CODE: 403,
    MESSAGE: '没有权限执行此操作',
  };
  static readonly NotFound: CodeAndMsg = {
    CODE: 404,
    MESSAGE: '找不到请求的资源',
  };

  static readonly LoginError: CodeAndMsg = {
    CODE: 1000,
    MESSAGE: '用户名或密码错误',
  };
  static readonly LoginTimeout: CodeAndMsg = {
    CODE: 1001,
    MESSAGE: '登录超时',
  };
  static readonly InActive: CodeAndMsg = { CODE: 1002, MESSAGE: '账号未激活' };

  static readonly TokenError: CodeAndMsg = { CODE: 1003, MESSAGE: 'token错误' };
  static readonly Frozen: CodeAndMsg = { CODE: 1004, MESSAGE: '账号已冻结' };

  static codeToMessage(code: number): string {
    for (const key of Object.keys(this)) {
      if (code === this[key].CODE) {
        return this[key].MESSAGE;
      }
    }
    return '';
  }

  static hasCode(code: number): boolean {
    for (const key of Object.keys(this)) {
      if (code === this[key].CODE) {
        return true;
      }
    }
    return false;
  }
}
