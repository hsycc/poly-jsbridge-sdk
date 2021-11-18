/**
 * @format
 * @Author: hsycc
 * @Date: 2021-09-21 18:16:35
 * @LastEditTime: 2021-11-18 10:41:17
 * @Description:
 */

import { defaultConfig } from './config';
import Jsbridge from './jsbridge';
import type { ClientResponse, Config } from './type';

class PolyJsbridgeSdk {
  $jsbridge: Jsbridge;
  $register: (name: string) => void;
  $off: (name: string, func?: any) => any;
  $on: (name: string, func: any) => any;
  $call: (method: string, payload: object, hasCallback: boolean | string) => Promise<any>;

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
   *  _init register function to app call.
   */
  public async _init(): Promise<void> {
    // @ts-ignore
    window.$jsbridge = this.$jsbridge;
    this.$register('log');
    this.$on('log', (result: any) => {
      console.log(result);
    });
  }

  /**
   * exit  app
   */
  public exitApp(): Promise<ClientResponse> {
    return this.$jsbridge.$call('exitApp', {}, false);
  }

  /**
   * app toast
   *
   * @param message
   * @param hasCallback
   */
  public toast(message: string, hasCallback: boolean | string = false): Promise<ClientResponse> {
    return this.$jsbridge.$call(
      'toast',
      {
        message,
      },
      hasCallback,
    );
  }

  /**
   * print log in app
   *
   * @param message
   * @param hasCallback
   */

  public log(message: any, hasCallback: boolean | string = false): Promise<ClientResponse> | null {
    return this.$jsbridge.$call(
      'log',
      {
        message,
      },
      hasCallback,
    );
  }

  /**
   * app navigator to
   *
   * @param url
   * @param hasCallback
   */
  public navigatorTo(url: string, hasCallback: boolean | string = false): Promise<ClientResponse> {
    return this.$jsbridge.$call(
      'navigatorTo',
      {
        url,
      },
      hasCallback,
    );
  }

  /**
   * app navigator back
   *
   * @param url
   * @param
   */
  public navigatorBack(url: string, hasCallback: boolean | string = false): Promise<ClientResponse> {
    return this.$jsbridge.$call(
      'navigatorBack',
      {
        url,
      },
      hasCallback,
    );
  }

  /**
   * redirec current app page to url
   *
   * @param url
   * @param hasCallback
   */
  public redirectTo(url: string, hasCallback: boolean | string = false): Promise<ClientResponse> {
    return this.$jsbridge.$call(
      'redirectTo',
      {
        url,
      },
      hasCallback,
    );
  }

  /**
   * get app resgiter list
   *
   */
  public getResgiterList(hasCallback: boolean | string = true): Promise<ClientResponse> {
    return this.$jsbridge.$call('getResgiterList', {}, hasCallback);
  }
}

export type { PolyJsbridgeSdk };
export default PolyJsbridgeSdk;
