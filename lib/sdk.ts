/*
 * @Author: hsycc
 * @Date: 2021-09-21 18:16:35
 * @LastEditTime: 2021-11-17 12:48:44
 * @Description:ts
 *
 */

import { defaultConfig } from './config';
import Jsbridge from './jsbridge';
import type { ClientResponse, Config } from './type';

class EasyJsbridgeSdk {
  $jsbridge: Jsbridge;
  $register: (name: string) => void;
  $off: (name: string, func?: any) => any;
  $on: (name: string, func: any) => any;
  $call: (
    method: string,
    payload: object,
    hasCallback: boolean | string
  ) => Promise<any>;

  constructor(config?: Config) {
    config = Object.assign(defaultConfig, config || {});
    const jsbridge = new Jsbridge(config);
    this.$jsbridge = jsbridge;
    this.$on = jsbridge.$on.bind(jsbridge);
    this.$off = jsbridge.$on.bind(jsbridge);
    this.$call = jsbridge.$call.bind(jsbridge);
    this.$register = jsbridge.$register.bind(jsbridge);
    this._init();
  }

  /**
   *  _init register  to native eval
   */
  private async _init(): Promise<void> {
    // @ts-ignore
    window.$jsbridge = this.$jsbridge 
    this.$register('log');
    this.$on('log', (result: any) => {
      console.log(result);
    });
  }

  /**
   * exit  app
   */
  exitApp(): Promise<ClientResponse> {
    return this.$jsbridge.$call('exitApp', {}, false);
  }

  /**
   * app toast
   *
   * @param message
   * @param hasCallback
   */
  toast(
    message: string,
    hasCallback: boolean | string = false
  ): Promise<ClientResponse> {
    return this.$jsbridge.$call(
      'toast',
      {
        message,
      },
      hasCallback
    );
  }

  /**
   * print log in app
   *
   * @param message
   * @param hasCallback
   */

  print(
    message: any,
    hasCallback: boolean | string = false
  ): Promise<ClientResponse> | null {
    return this.$jsbridge.$call(
      'print',
      {
        message,
      },
      hasCallback
    );
  }
}

export type { EasyJsbridgeSdk };
export default EasyJsbridgeSdk;
