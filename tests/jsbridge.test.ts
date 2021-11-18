/*
 * @Author: hsycc
 * @Date: 2021-11-16 11:36:30
 * @LastEditTime: 2021-11-18 14:50:55
 * @Description:
 *
 */

'use strict';
import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import Jsbridge from '../lib/jsbridge';
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
const $jsbridge:any = new Jsbridge({
  mode: SendModeEnum.CHANNEL,
  maxTryTimes: 3,
  isDebug: true,
  protocol: '',
  JavascriptChannelName: 'PolySdk',
});

describe('test jsbridge', () => {
  it('$register', () => {
    assert($jsbridge.$register);
    $jsbridge.$register('log2');
    console.log('      register log2');
    
  });

  it('$on', () => {
    $jsbridge.$on('log2', () => {
      console.log('      trigger log2');
    });
    assert($jsbridge.log2);
    assert($jsbridge.event._events.log2);

    $jsbridge.log2() // event emit event._events.log2
  });

  it('$off', () => {
    assert($jsbridge.event._events.log2); 
    $jsbridge.$off('log2')
    try {
      assert($jsbridge.event._events.log2);  
    } catch (error) {
      console.log('      removeListener event log2');
    }
  });

  it('getCallbackId', () => {
    assert($jsbridge.getCallbackId);
    console.log('      ' + $jsbridge.getCallbackId());
  });

  it('encode', () => {
    assert($jsbridge.encode);
  });

  it('decode', () => {
    assert($jsbridge.decode);
  });

  it('generateMessage', () => {
    assert($jsbridge.generateMessage);
  });

  it('sendMessage', () => {
    assert($jsbridge.sendMessage);
  });

  it('$call', () => {
    assert($jsbridge.$call);
  });
});
