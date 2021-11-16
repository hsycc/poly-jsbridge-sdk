/*
 * @Author: hsycc
 * @Date: 2021-11-16 11:36:30
 * @LastEditTime: 2021-11-16 15:31:14
 * @Description:
 *
 */

'use strict';
import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import EasyJsSdk from '../lib';
import { SendModeEnum } from '../lib/type';

// add browser env
const window = new JSDOM(``, { runScripts: 'outside-only' }).window;
// @ts-ignore 
global.window = window;
global.document = window.document;

describe('init EasyJsSdk', () => {
  it('Mode JavascriptChannel', () => {
    window.AppSdk = {
      postMessage(msg: string) {
        return msg;
      },
    };
    const easyJsSdk = new EasyJsSdk({
      mode: SendModeEnum.CHANNEL,
      maxTryTimes: 3,
      isDebug: true,
      protocol: '',
      JavascriptChannelName: 'AppSdk',
    });
    assert(easyJsSdk.toast('say hello', true))
  });

  it('Mode navigationDelegate', () => {
    const easyJsSdk = new EasyJsSdk({
      mode: SendModeEnum.URL,
      maxTryTimes: 3,
      isDebug: true,
      protocol: 'flutter://',
      JavascriptChannelName: '',
    });
    assert(easyJsSdk.toast('say hello', true))
  });
});
