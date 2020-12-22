import BaseConfig from './BaseConfig';

export default class StaticConfig extends BaseConfig {
  readonly staticUrl: string;
  readonly jsPath: string;
  readonly cssPath: string;
  readonly imgPath: string;
  readonly fontPath: string;
  readonly uploadImgUrl: string;
  readonly imgFormat: string;
  readonly imgMaxSize: number;
  readonly imgMaxSizeErr: string;//错误信息

  constructor(cfg) {
    super(cfg);
  }
}