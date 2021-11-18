# poly-jsbridge-sdk

[![CI status][github-action-image]][github-action-url]
[![codecov][codecov-image]][codecov-url]
[![NPM version][npm-image]][npm-url]
[![NODE version][node-image]][node-url]

[github-action-image]: https://github.com/hsycc/poly-jsbridge-sdk/workflows/test/badge.svg
[github-action-url]: https://github.com/hsycc/poly-jsbridge-sdk/actions/workflows/test.yml
[codecov-image]: https://coveralls.io/repos/github/hsycc/poly-jsbridge-sdk/badge.svg?branch=main
[codecov-url]: https://coveralls.io/github/hsycc/poly-jsbridge-sdk?branch=main
[npm-image]: https://img.shields.io/badge/npm-v4.16.13-blue
[npm-url]: http://npmjs.org/package/poly-jsbridge-sdk

[node-image]: https://img.shields.io/badge/node-v12.0.0-blue
[node-url]: https://nodejs.org/

Poly jsbridge protocol scheme.

Support with JavascriptChannel and navigationDelegate (url scheme).

Poly App 的 jsbridge 协议方案。

支持 JavascriptChannel 和 navigationDelegate。

## Install

```bash
npm install poly-jsbridge-sdk
```

```bash
yarn add poly-jsbridge-sdk
```

## Config

mode: JavascriptChannel

example:

window.postMessage(msg) || window[JavascriptChannelName].postMessage(msg)

msg format:

{"method":"toast","payload":{"message":"你好"},"callbackId":"poly_sdk_callback_1632727252090577"}

```ts
import { Config, SendModeEnum } from 'poly-jsbridge-sdk';

const initConfig: Config = {
  maxTryTimes: 3,
  isDebug: true,
  protocol: '',
  mode: SendModeEnum.CHANNEL, //  'channel' | 'url'
  JavascriptChannelName: 'PolySdk', // your app JavascriptChannel name,  can use 'window'
};
```

mode: navigationDelegate (url scheme)

example:

document.createElement('IFRAME');
iframe.setAttribute('src', url);

url scheme:

encodeURIComponent('poly://toast?payload={"message":"say hello"}?callbackId=poly_sdk_callback_163699755451280')

<!-- poly://toast?payload=%7B%22message%22%3A%22say%20hello%22%7D?callbackId=poly_sdk_callback_163699755451280 -->

```ts
import { Config, SendModeEnum } from 'poly-jsbridge-sdk';

const initConfig: Config = {
  maxTryTimes: 3,
  isDebug: true,
  protocol: 'poly://', // your custom protocol
  mode: SendModeEnum.URL,
  JavascriptChannelName: '',
};
```

## Usage

in cjs/esm

```ts
import { polyJsbridgeSdk, ClientResponse } from 'poly-jsbridge-sdk';

const polyJsbridgeSdk: PolyJsbridgeSdk = new PolyJsbridgeSdk(initConfig);

const toast = async () => {
  try {
    // send data to app
    const res: ClientResponse = await polyJsbridgeSdk.toast('你好', true);
    // res.code === 200
  } catch (error) {
    // res.code !== 200 or error
    console.log(error?.message);
  }
};

toast();

// NOTE:
// polyJsbridgeSdk.toast('say hello', true); be equivalent to
// polyJsbridgeSdk.$jsbridge.$call(
//   'toast',
//   {
//     message,
//   },
//   hasCallback // has ackcallback web to once ack
//   // 是否回调web完成一次ack
// );

// the app will received this data. 
// (example: {"method":"toast","payload":{"message":"你好"},"callbackId":"poly_sdk_callback_1632727252090577"})
// app 将接收这些数据。 
// (example: {"method":"toast","payload":{"message":"你好"},"callbackId":"poly_sdk_callback_1632727252090577"})
//
// after format this data and process the corresponding logic in app, response your data. 
// response data  needs to be followed ClientResponse: '{code: number, data: any ,  message: string;}'
// 格式化该数据后，在 app 中处理相应的逻辑, 回传响应结果,
// 响应数据需要遵循 ClientResponse 格式 {code: number, data: any ,  message: string;}
//
// in app webController
// await webController.evaluateJavascript("window.$jsbridge.$poly_sdk_callback_1632727252090577(${your response data});");
// be equivalent to window.eval in web
//
// window.$jsbridge.$poly_sdk_callback_1632727252090577 will be destroyed after once call.
// window.$jsbridge.$poly_sdk_callback_1632727252090577 将在一次调用后销毁。

```

in browser

```html
<!DOCTYPE html>
<html>
  <head>
    <script src=".../dist/browser/polyJsbridgeSdk.js"></script>
  </head>
  <body>
    <script>
      const polyJsbridgeSdk = new PolyJsbridgeSdk.default(initConfig);
      // ... same as in cjs/esm
    </script>
  </body>
</html>
```

## jsbridge registers function

The web actively registers for the app to call.

web 主动注册函数 让 app 调用。

in web

```ts
// after init PolyJsbridgeSdk ||  init Jsbridge
// 初始化 PolyJsbridgeSdk 或者 Jsbridge 后
$jsbridge.$register('log2');
$jsbridge.$on('log2', (result: any) => {
  console.log(result);
});

// you can see the function has bound in $jsbridge。
console.log($jsbridge.log2);

// you can off this function.
// 可以注销主动注册的函数。
$jsbridge.$off('log2', () => {
  // you code
});

console.log($jsbridge.log2); // throw error
```

in app

```dart
await webController.evaluateJavascript("window.$jsbridge.$log2(${your log});");
// be equivalent to : in web
// 等价于在 web 环境执行
// await window.eval("window.$jsbridge.$log2(${your log});");
// then it's can trigger the function with jsbridge.$on bound in web.
// 触发 jsbridge.$on 绑定的函数。

```

## extends / 继承

```ts
  import { PolyJsbridgeSdk Config } from 'poly-jsbridge-sdk';
  class YourSDK extend PolyJsbridgeSdk {
    constructor(config?: Config) {
      super(config);
    }
    public async _init(): Promise<void> {
      super._init(); // extends PolyJsbridgeSdk.init

      // PolyJsbridgeSdk.init has do this.
      // @ts-ignore
      // window.$jsbridge = this.$jsbridge; // mount to a global variable 
      // this.$register('log');
      // this.$on('log', (result: any) => {
      //   console.log(result);
      // });

      // add you register function
      this.$register('log2');
      this.$on('log2', (result: any) => {
        console.log(result);
      });
      // ...
    }
  }

```

## app jsbridge principle / app 桥接实现

complete parallel example : see [poly-webview-flutter-jsbridge-demo](https://github.com/hsycc/poly-webview-flutter-jsbridge-demo)

```dart
import 'package:webview_flutter/webview_flutter.dart';


// after web  emit polyJsbridgeSdk.toast('say hello', true);
// in webviewCtrl
const webviewCtrl  = weview(
  // ...
  // mode javascriptChannel
  javascriptChannels: <JavascriptChannel>[
    JavascriptChannel(
      name: 'PolySdk',
      onMessageReceived: (JavascriptMessage message) async {
        String jsonStr = message.message;

        // serialization/序列化
        var model = parseJson(jsonStr); // {"method":"toast","payload":{"message":"你好"},"callbackId":"poly_sdk_callback_1632727252090577"}
        // add you code
        // const resultStr = ...
        await webController.evaluateJavascript("window.$jsbridge.$callbackId($resultStr);");

    }),
  ].toSet(),
  //  mode navigationDelegate (url scheme)
  navigationDelegate: (NavigationRequest request) {
      if (request.url.startsWith('poly://')) {
        // request.url poly://toast?payload=%7B%22message%22%3A%22say%20hello%22%7D?callbackId=poly_sdk_callback_163699755451280
        // serialization/序列化
        // var model = ... format request.url; // {"method":"toast","payload":{"message":"你好"},"callbackId":"poly_sdk_callback_1632727252090577"}
        // add you code
        // const resultStr ...
        await webController.evaluateJavascript("window.$jsbridge.$callbackId($resultStr);");

        return NavigationDecision.prevent; // reject navigate
      }
      return NavigationDecision.navigate; // narmal navigate other url
    },
  // ...
)


```

## TODO：

- [ ] eventEmitter use typescript
- [ ] fix @ts-ignore

