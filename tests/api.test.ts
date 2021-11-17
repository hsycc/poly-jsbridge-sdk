/*
 * @Author: hsycc
 * @Date: 2021-11-16 11:36:30
 * @LastEditTime: 2021-11-17 14:00:46
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

describe('check api list', () => {
  it('toast', () => {
    assert(easyJsbridgeSdk.toast('say hello', true))
  });

  it('print', () => {
    assert(easyJsbridgeSdk.print('print hello', true))
  });

  it('exitApp', () => {
    assert(easyJsbridgeSdk.exitApp())
  });
});
