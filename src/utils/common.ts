import * as _ from 'lodash';

/**
 * 随机码
 * @param basicArr
 * @param scale
 */
export const genRandom = (basicArr: any[], scale: number): any => {
    let codeArr = _.shuffle(basicArr);
    codeArr = codeArr.slice(0, scale);
    const code = codeArr.join('');
    return code;
};