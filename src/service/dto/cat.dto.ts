import {
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CatDto {
  @MinLength(1, { message: '名称不能为空' })
  @MaxLength(50, { message: '名称不能超过 $constraint1 个字符' })
  @IsString()
  readonly name: string;

  @MinLength(1, { message: '世上没有隐形猫' })
  @IsString()
  readonly colour: string;

  @IsString()
  readonly breed: string;

  @ValidateIf((object) => {
    return object && typeof object.coverURL !== 'undefined';
  })
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  readonly image: string;
}
