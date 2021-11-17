/*
 * @Author: hsycc
 * @Date: 2021-11-16 11:36:30
 * @LastEditTime: 2021-11-17 14:26:29
 * @Description:
 *
 */

'use strict';
import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import EasyJsbridgeSdk from '../lib/sdk';
import { SendModeEnum } from '../lib/type';

// add browser env
const window = new JSDOM(``, { runScripts: 'outside-only' }).window;
// @ts-ignore 
global.window = window;
global.document = window.document;

describe('init EasyJsbridgeSdk', () => {
  it('Mode JavascriptChannel', () => {
    window.AppSdk = {
      postMessage(msg: string) {
        return msg;
      },
    };
    const easyJsbridgeSdk = new EasyJsbridgeSdk({
      mode: SendModeEnum.CHANNEL,
      maxTryTimes: 3,
      isDebug: true,
      protocol: '',
      JavascriptChannelName: 'AppSdk',
    });
    assert(easyJsbridgeSdk.toast('say hello', true))
  });

  it('Mode navigationDelegate', () => {
    const easyJsbridgeSdk = new EasyJsbridgeSdk({
      mode: SendModeEnum.URL,
      maxTryTimes: 3,
      isDebug: true,
      protocol: 'flutter://',
      JavascriptChannelName: '',
    });
    assert(easyJsbridgeSdk.toast('say hello', true))
  });
});
