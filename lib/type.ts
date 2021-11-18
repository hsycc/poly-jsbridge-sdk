/**
 * @format
 * @Author: hsycc
 * @Date: 2021-09-21 18:16:58
 * @LastEditTime: 2021-11-16 00:48:29
 * @Description:
 */

export enum SendModeEnum {
  'CHANNEL' = 'channel',
  'URL' = 'url',
}

/** init param */
export type Config = {
  mode?: 'channel' | 'url';

  /** Maximum number of requests */
  maxTryTimes: number;

  /** debug mode */
  isDebug?: boolean;

  /** protocol */
  protocol: string;

  /** native channel name */
  JavascriptChannelName: string;
};

export type ClientResponse = {
  /** status code */
  code: number;

  /** callback data */
  data?: any;

  /** callback message */
  message: string;
};
