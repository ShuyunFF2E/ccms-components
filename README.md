# CCMS Components [![Build Status](https://img.shields.io/travis/ShuyunFF2E/ccms-components/master.svg?style=flat)](https://travis-ci.org/ShuyunFF2E/ccms-components) [![npm version](https://img.shields.io/npm/v/ccms-components.svg?style=flat)](https://www.npmjs.com/package/ccms-components)

开发指南 [Angular1.x + ES6 开发风格指南](https://github.com/kuitos/kuitos.github.io/issues/34)

## Document
[组件API文档](http://shuyunff2e.github.io/ccms-components/)

## Dependencies
* [angular](https://www.npmjs.com/package/angular)
* [angular-resource](https://www.npmjs.com/package/angular-resource)
* [angular-ui-router](https://www.npmjs.com/package/angular-ui-router)

## How To Use

```bash
npm install --save ccms-components
```

### ES6
```js
import angular from 'angular';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';

import ccmsComponents from 'ccms-components';

angular.module('app', [ngResource, uiRouter, ccmsComponents]);
```

### ES5
```html
<link rel="stylesheet" href="/node_modules/ccms-components.css">
....
<script src='/node_modules/angular/angular.js'></script>
<script src='/node_modules/angular-resource/angular-resource.js'></script>
<script src="/node_modules/angular-ui-router/release/angular-ui-router.js"></script>

<script src='/node_modules/ccms-components.js'></script>
```

## 友情提示
ccms模块产品请将组件库手动设置到webpack的externals中，避免重复打包

```js
externals: {'ccms-components': '\'ccms.components\''}
```

