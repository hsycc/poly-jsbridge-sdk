# easy-jsbridge-sdk

[![CI status][github-action-image]][github-action-url]
[![codecov][codecov-image]][codecov-url]
[![NPM version][npm-image]][npm-url]

[github-action-image]: https://github.com/hsycc/easy-jsbridge-sdk/workflows/test/badge.svg
[github-action-url]: https://github.com/hsycc/easy-jsbridge-sdk/actions/workflows/test.yml
[codecov-image]: https://coveralls.io/repos/github/hsycc/easy-jsbridge-sdk/badge.svg?branch=main
[codecov-url]: https://coveralls.io/github/hsycc/easy-jsbridge-sdk?branch=main
[npm-image]: https://img.shields.io/badge/npm-v4.16.13-blue
[npm-url]: http://npmjs.org/package/easy-jsbridge-sdk

A simple jsbridge protocol scheme.

Support with JavascriptChannel and navigationDelegate (url scheme).

一个简单的 jsbridge 协议方案。

支持 JavascriptChannel 和 navigationDelegate。

## Install

```bash
npm install easy-jsbridge-sdk
```

```bash
yarn add easy-jsbridge-sdk
```

## Usage

mode: JavascriptChannel

example:

window.postMessage(msg) || window[JavascriptChannelName].postMessage(msg)

msg format: {"method":"toast","payload":{"message":"你好"},"callbackId":"app_sdk_callback_1632727252090577"}

```ts
import { Config, SendModeEnum } from 'easy-jsbridge-sdk';

const initConfig: Config = {
  maxTryTimes: 3,
  isDebug: true,
  protocol: '',
  mode: SendModeEnum.CHANNEL, //  'channel' | 'url'
  JavascriptChannelName: 'AppSdk', // your app JavascriptChannel name,  can use 'window'
};
```

mode: navigationDelegate (url scheme)

example:

document.createElement('IFRAME');
iframe.setAttribute('src', url);

url scheme: encodeURIComponent('flutter://toast?payload={"message":"say hello"}?callbackId=app_sdk_callback_163699755451280')

<!-- flutter://toast?payload=%7B%22message%22%3A%22say%20hello%22%7D?callbackId=app_sdk_callback_163699755451280 -->

```ts
import { Config, SendModeEnum } from 'easy-jsbridge-sdk';

const initConfig: Config = {
  maxTryTimes: 3,
  isDebug: true,
  protocol: 'flutter://', // your custom protocol
  mode: SendModeEnum.URL,
  JavascriptChannelName: '',
};
```

in cjs/esm

```ts
import { easyJsbridgeSdk } from 'easy-jsbridge-sdk';

const easyJsbridgeSdk: EasyJsbridgeSdk = new EasyJsbridgeSdk(initConfig);

easyJsbridgeSdk.toast('say hello', true);
```

in browser

```html
<!DOCTYPE html>
<html>
  <head>
    <script src=".../dist/browser/easyJsbridgeSdk.js"></script>
  </head>
  <body>
    <script>
      easyJsbridgeSdk = new EasyJsbridgeSdk.default(initConfig);
      easyJsbridgeSdk.toast('say hello', true);
    </script>
  </body>
</html>
```
