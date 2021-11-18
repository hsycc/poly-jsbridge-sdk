/**
 * @format
 * @Author: hsycc
 * @Date: 2021-11-16 11:36:30
 * @LastEditTime: 2021-11-18 11:04:43
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

describe('test sdk api', () => {
  it('check window.$jsbridge', () => {
    assert(polyJsbridgeSdk._init());
    assert(window.$jsbridge);
  });

  it('check register function log', () => {
    assert(polyJsbridgeSdk._init());
    assert(window.$jsbridge.log);

    window.$jsbridge.log('print register.log');
  });

  it('check toast', () => {
    assert(polyJsbridgeSdk.toast('say hello', true));
  });

  it('check log', () => {
    assert(polyJsbridgeSdk.log('print hello', true));
  });

  it('check exitApp', () => {
    assert(polyJsbridgeSdk.exitApp());
  });

  it('check navigatorTo', () => {
    assert(polyJsbridgeSdk.navigatorTo('/demo'));
  });

  it('check navigatorBack', () => {
    assert(polyJsbridgeSdk.navigatorBack('/demo'));
  });

  it('check redirectTo', () => {
    assert(polyJsbridgeSdk.redirectTo('/demo'));
  });

  it('check getResgiterList', () => {
    assert(polyJsbridgeSdk.getResgiterList());
  });
});
