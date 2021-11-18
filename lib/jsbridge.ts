/**
 * @format
 * @Author: hsycc
 * @Date: 2021-09-21 18:22:19
 * @LastEditTime: 2021-11-18 15:46:01
 * @Description:
 */

import { Config, ClientResponse, SendModeEnum } from './type';

const EventEmitter = require('events');

class Jsbridge {
  public config: Config;
  private tryTimes = 0;
  private isInBrowser: boolean;
  private event: any;
  constructor(config: Config) {
    this.event = new EventEmitter();
    this.config = config;
    this.isInBrowser = !!(typeof window !== 'undefined');
  }

  /** call message and send to client */
  public $call(method: string, payload: object, hasCallback: boolean | string): Promise<ClientResponse> {
    payload = payload || {};
    // in browser
    if (this.isInBrowser) {
      // TODO: custom callback id case calls the registered function
      // if (typeof hasCallback === 'string') {
      // }

      const that = this;

      return new Promise((resolve, reject) => {
        const callbackId = hasCallback ? this.getCallbackId() : '';
        const message = this.generateMessage(method, payload, callbackId);
        if (that.config.isDebug) {
          console.debug('send', message);
        }

        if (callbackId) {
          this.$register(callbackId);
          this.$on(callbackId, (result: ClientResponse) => {
            if (that.config.isDebug) {
              console.debug(`[${callbackId}]:`, result);
            }
            try {
              if (result.code === 200) {
                resolve(result);
              } else {
                // status code error
                reject(result);
              }
            } catch (error) {
              reject(error);
            } finally {
              // unsubscribe callbackId
              this.$off(callbackId);
            }
          });
        }

        this.sendMessage(message);
      });
    } else {
      console.error('does not support poly-jsbridge-sdk');
      return new Promise((resolve, reject) => {
        reject('does not support poly-jsbridge-sdk');
      });
    }
  }

  /** subscribe */
  public $on(name: string, func: (result: ClientResponse) => any): any {
    if (this.event._events[name]) {
      this.$off(name);
    }
    this.event.on(name, func);
    return this;
  }

  /** unsubscribe */
  public $off(name: string, func?: (result: ClientResponse) => any): any {
    if (func) {
      this.event.removeListener(name, func);
    } else {
      this.event.removeAllListeners(name);
    }
    return this;
  }

  /** register */
  public $register(name: string): void {
    const ar: string[] = name.split('.');
    const len: number = ar.length;
    let obj = this;
    const eventName = ar.join('_');

    ar.forEach((el, idx) => {
      if (idx === len - 1) {
        // @ts-ignore
        obj[el] = (json: any) => {
          this.event.emit(eventName, json);
        };
      } else {
        // @ts-ignore
        obj[el] = obj[el] || {};
        // @ts-ignore
        obj = obj[el];
      }
    });
  }

  /**
   * Generate the message
   *   {"method":"toast","payload":{"message":"你好"},"callbackId":"poly_sdk_callback_1632727252090577"}
   *   or
   *   poly://toast?payload=%7B%22message%22%3A%22say%20hello%22%7D?callbackId=poly_sdk_callback_163699755451280
   */
  private generateMessage(method: string, payload: object | {}, callbackId?: string): string {
    if (this.config.mode === SendModeEnum.CHANNEL) {
      const message = {
        method,
        payload,
      };

      if (callbackId) {
        Object.assign(message, {
          callbackId,
        });
      }

      return JSON.stringify(message);
    } else {
      const payloadData = this.encode(payload);
      let message = this.config.protocol.concat(method).concat('?payload=').concat(payloadData);

      if (callbackId) {
        message = message.concat('&callbackId=').concat(callbackId);
      }

      return message;
    }
  }

  /**
   *
   * encode the data
   * Parse Javascript Object to params String
   * `JSON.stringify() -> encodeURIComponent()`
   */
  private encode(obj: object): string {
    const json = JSON.stringify(obj);
    return encodeURIComponent(json);
  }

  /**
   *
   * decode the data
   * Parse url params data to string
   * `decodeURIComponent() -> JSON.parse()`
   */
  private decode(str: string): object {
    // const decodeURL = atob(str);
    const jsonStr = decodeURIComponent(str);
    return JSON.parse(jsonStr);
  }

  /**
   * Generate random string, begin with `poly_sdk_callback_[random]`
   */
  private getCallbackId(): string {
    const random = parseInt(Math.random() * 10000 + '');
    return 'poly_sdk_callback_' + new Date().getTime() + random;
  }

  /**
   * Post message to client
   */
  public sendMessage(msg: string): void {
    // browser
    if (this.isInBrowser) {
      try {
        if (this.config.mode === SendModeEnum.CHANNEL) {
          // @ts-ignore
          this.config.JavascriptChannelName === 'window'
            ? // @ts-ignore
              window.postMessage(msg)
            : // @ts-ignore
              window[this.config.JavascriptChannelName].postMessage(msg);
        } else {
          // create iframe
          // const document = window.document
          let iframe: HTMLElement | null = document.createElement('IFRAME');
          iframe.setAttribute('src', msg);
          document.documentElement.appendChild(iframe);
          iframe.parentNode?.removeChild(iframe);
          iframe = null;
        }
        // reset the tryTime to first
        this.tryTimes = 1;
      } catch (error) {
        // per second will attempt to reinvoke, failed over  maxTryTimes will never reinvoked again
        if (this.tryTimes < this.config.maxTryTimes) {
          setTimeout(() => {
            this.sendMessage(msg);
            this.tryTimes = ++this.tryTimes;
          }, 1000);
        } else {
          throw new Error(`post msg timeout( ${this.config.maxTryTimes} times): ${msg} \n , error: ${error}`);
        }
      }
    } else {
      // nodejs
      throw new Error('Method not implemented.');
    }
  }
}

export default Jsbridge;
