# CCMS Components 
[![Build Status](https://img.shields.io/travis/ShuyunFF2E/ccms-components/master.svg?style=flat-square)](https://travis-ci.org/ShuyunFF2E/ccms-components) 
[![npm version](https://img.shields.io/npm/v/ccms-components.svg?style=flat-square)](https://www.npmjs.com/package/ccms-components)
[![npm downloads](https://img.shields.io/npm/dt/ccms-components.svg?style=flat-square)](https://www.npmjs.com/package/ccms-components)
[![coverage](https://img.shields.io/codecov/c/github/ShuyunFF2E/ccms-components/dev.svg?style=flat-square)](https://www.npmjs.com/package/ccms-components)

[组件 API 文档](http://shuyunff2e.github.io/ccms-components/components/)

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
3. 提交的组件, Controller 部分需同时提交单元测试,不符合无法通过review。如果是开发的新 feature ,同时需要提供 docs 文档及相应demo。
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

### 发现 bug 怎么办

1. [提交 issue](https://github.com/ShuyunFF2E/ccms-components/issues) 描述问题，与相关人员确认是否是 bug
2. 确认是 bug
   * 如果对 bug 修复时效不敏感，等待/提醒 组件库相关维护人员修复 bug 并发布版本。最后 portal 发布新版本组件库时，bug 自动修复。(周期通常较长，deprecated！)
   * 如果对 bug 修复时效很敏感(影响产品发布时间)。遵照以下步骤（推荐）：
     1. 将相应组件的代码 copy 到自己项目(通常为组件文件夹)，在原始组件代码基础上修复 bug，并给组件起一个别名(如 cc-menu 改为 cc-xxx-menu )，项目中改为使用 cc-xxx-menu。
     2. 确认修复代码可行后，将代码提交给组件库，等待组件库合并代码。[提交步骤](ccms-components#开发步骤)
     3. 组件库合并代码后发布版本，portal 更新组件库后发布。
     4. 将项目里的 cc-xxx-menu 还原成 cc-menu。

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

### 发布脚本

release 脚本

```bash
# 正式版本
npm run release -- <version_category: major | minor | patch>

# 测试版本
npm run release -- <version_category: major | minor | patch> --branch <branch_name>
```

以下是 release 脚本内部所执行的子任务，其中正式版本执行 [1, 2, 3, 4]，测试版本执行 [1, 2, 3]。当 release 脚本出错中断时，可以手动运行对应的脚本进行发布（需要注意参数）。

1. 处理分支，打标签

   ```bash
   # 正式版本
   npm run prepare-production -- <version_category: major | minor | patch>

   # 测试版本
   npm run prepare-test -- <version_category: major | minor | patch> --branch <branch_name>
   ```

2. build

   ```bash
   # build 代码，产出到 dist/ 中
   # 可以指定 git_revision 参数（如 master / v2.0.1 / 0abcdef），默认 build 当前 working tree 代码
   npm run build [-- <git_revision>]
   ```

3. 发布 npm 包

   ```bash
   # 将 dist/ 中 build 好的代码上传到 npm 仓库
   npm run publish:package
   ```

4. 发布文档

   ```bash
   # 发布 gh-pages 文档
   # 可以指定代码版本参数（如 v2.0.1），默认发布最新的代码版本
   npm run publish:docs [-- <version_tag>]
   ```

