# CCMS Components 
[![Build Status](https://img.shields.io/travis/ShuyunFF2E/ccms-components/master.svg?style=flat)](https://travis-ci.org/ShuyunFF2E/ccms-components) 
[![npm version](https://img.shields.io/npm/v/ccms-components.svg?style=flat)](https://www.npmjs.com/package/ccms-components)
[![npm downloads](https://img.shields.io/npm/dt/ccms-components.svg?style=flat)](https://www.npmjs.com/package/ccms-components)
[![coverage](https://img.shields.io/codecov/c/github/ShuyunFF2E/ccms-components/dev.svg?style=flat)](https://www.npmjs.com/package/ccms-components)

[组件 API 文档](http://shuyunff2e.github.io/ccms-components/)

开发指南 [Angular1.x + ES6 开发风格指南](https://github.com/kuitos/kuitos.github.io/issues/34) [ccms开发指南](https://github.com/ShuyunFF2E/ccms-angular-styleguide)

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

> #### 使用 ccms-portal 的项目不需要重复打包 ccms-components

> 由于 ccms-portal 中已经引入 ccms-components，所以相关项目在使用 webpack 打包时可忽略 ccms-components，配置如下：

> ```js
> externals: {'ccms-components': '\'ccms.components\''}
> ```

## 贡献代码

### 组件库规范
在遵照基本的开发指南基础上,组件库额外的规范:

1. 需要对外暴露的服务,以 `$cc` 为前缀,如 `$ccModal`
2. 组件库组件均以 `cc-xx` 形式提供,如`cc-grid`. (cc => ccms-component 首字母)
3. 提交的组件, Controller 部分需同时提交单元测试,不符合无法通过review。
4. 其他规范遵照目前已有组件的风格。

### 开发步骤

1. ccms-components 组内的人员直接 **clone** 本项目；其它人员请 **fork** 本项目。

2. 基于 dev 分支创建你的分支，例如 feature/abc, bugfix/abc, docs/abc

3. 开发完成之后，在 github 网页中创建一个 pull request，base 为 dev，compare 为你的分支名

4. 等待上游 review，merge pull request

5. 在开始另一个功能开发创建新分支之前，应当先将 dev 分支同步为最新的状态。

	```bash
	# 对于 ccms-components 组内的人员，在 dev 分支拉取更新
	git pull

	# 对于 fork 本项目的人员，需要先将本项目添加为一个 git remote，再拉取更新，参考以下操作
	# step 1，添加一个 remote
	git remote add ccms https://github.com/ShuyunFF2E/ccms-components
	# step 2, 在 dev 分支拉取 ccms 的更新
	git pull ccms
	```
6. 重复 2~5 的操作，创建新分支继续其它功能的开发

### 提交代码、pull request 准则

提交代码的 commit message 和 pull request 标题需按如下格式：

```
<type>(<scope>): <subject>
```

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

