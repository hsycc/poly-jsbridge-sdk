/**
 * @format
 * @Author: hsycc
 * @Date: 2021-11-16 11:36:30
 * @LastEditTime: 2021-11-18 13:58:30
 * @Description:
 */

'use strict';
import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import PolyJsbridgeSdk from '../lib/sdk';
import { SendModeEnum } from '../lib/type';

// add browser env
const window = new JSDOM(``, { runScripts: 'outside-only' }).window;
// @ts-ignore
global.window = window;
global.document = window.document;

describe('test init', () => {
  it('Mode JavascriptChannel', () => {
    window.PolySdk = {
      postMessage(msg: string) {
        return msg;
      },
    };
    const polyJsbridgeSdk: PolyJsbridgeSdk = new PolyJsbridgeSdk({
      mode: SendModeEnum.CHANNEL,
      maxTryTimes: 3,
      isDebug: true,
      protocol: '',
      JavascriptChannelName: 'PolySdk',
    });
    assert(polyJsbridgeSdk.toast('say hello', true));
  });

  it('Mode navigationDelegate', () => {
    const polyJsbridgeSdk: PolyJsbridgeSdk = new PolyJsbridgeSdk({
      mode: SendModeEnum.URL,
      maxTryTimes: 3,
      isDebug: true,
      protocol: 'poly://',
      JavascriptChannelName: '',
    });
    assert(polyJsbridgeSdk.toast('say hello', true));
  });
});
