/*
 * @Author: hsycc
 * @Date: 2021-09-21 18:16:47
 * @LastEditTime: 2021-11-16 00:49:41
 * @Description:
 *
 */
import { Config } from './type';

export const defaultConfig: Config = {
  mode: 'channel', // url
  maxTryTimes: 3,
  isDebug: true,
  protocol: 'poly://',
  JavascriptChannelName: 'PolySdk',
};
