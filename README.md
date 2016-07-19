# CCMS Components [![Build Status](https://img.shields.io/travis/ShuyunFF2E/ccms-components/master.svg?style=flat)](https://travis-ci.org/ShuyunFF2E/ccms-components) [![npm version](https://img.shields.io/npm/v/ccms-components.svg?style=flat)](https://www.npmjs.com/package/ccms-components)

[组件 API 文档](http://shuyunff2e.github.io/ccms-components/)

开发指南 [Angular1.x + ES6 开发风格指南](https://github.com/kuitos/kuitos.github.io/issues/34)

## 安装与使用

```bash
# 安装 ccms-components 和相关依赖
npm install --save ccms-components angular angular-resource angular-ui-router
```

### 引入方式

#### ES6
```js
import angular from 'angular';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';

import ccmsComponents from 'ccms-components';

angular.module('app', [ngResource, uiRouter, ccmsComponents]);
```

#### ES5
```html
<link rel="stylesheet" href="/node_modules/ccms-components.css">

<script src='/node_modules/angular/angular.js'></script>
<script src='/node_modules/angular-resource/angular-resource.js'></script>
<script src="/node_modules/angular-ui-router/release/angular-ui-router.js"></script>

<script src='/node_modules/ccms-components.js'></script>
```

### 避免重复打包

由于 ccms-portal 中已经引入 ccms-components，所以相关项目在使用 webpack 打包时可忽略 ccms-components，配置如下：

```js
externals: {'ccms-components': '\'ccms.components\''}
```

## 参与开发

### 基本的开发步骤

1. ccms-components 组内的成员直接 **clone** 本项目；其它人员请 **fork** 本项目。

2. 基于 dev 分支创建你的分支，例如 feature/abc, bugfix/abc, docs/abc

3. 开发完成之后，在 github 网页中创建一个 pull request，base 为 dev，compare 为你的分支名

4. 等待上游 review，merge pull request

5. 在开始另一个功能开发创建新分支之前，应当先将 dev 分支同步为最新的状态。

	```bash
	# 对于 ccms-components 组内的成员，在 dev 分支拉取更新
	git pull

	# 对于 fork 本项目的人员，需要先将本项目添加为一个 git remote，再拉取更新，参考以下操作
	# step 1，添加一个 remote
	git remote add ccms https://github.com/ShuyunFF2E/ccms-components
	# step 2, 在 dev 分支拉取 ccms 的更新
	git pull ccms
	```
6. 重复 2~5 的操作，创建新分支做开发

### 提交代码、pull request 准则

提交代码的 commit message 和 pull request 标题需按如果格式：

`<type>(<scope>): <subject>`

* `<type>`，变更的类型，可用的类型有以下几种：
	- **feat**，A new feature
	- **fix**，A bug fix
	- **docs**，Documentation only changes
	- **style**，Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
	- **refactor**，A code change that neither fixes a bug nor adds a feature
	- **perf**，A code change that improves performance
	- **test**，Adding missing tests
	- **chore**，Changes to the build process or auxiliary tools and libraries such as documentation generation

* `<scope>`，标记变更的范围，通常为你的模块名

* `<subject>`，用于描述的文字

