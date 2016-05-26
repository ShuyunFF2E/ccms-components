# CCMS Components [![Build Status](https://img.shields.io/travis/ShuyunFF2E/ccms-components/master.svg?style=flat)](https://travis-ci.org/ShuyunFF2E/ccms-components) [![npm version](https://img.shields.io/npm/v/ccms-components.svg?style=flat)](https://www.npmjs.com/package/ccms-components)

开发指南[Angular1.x + ES6 开发风格指南](https://github.com/kuitos/kuitos.github.io/issues/34)

## How To Use

```bash
npm install --save ccms-components
```

```js
import angular from 'angular';
import ccmsComponents from 'ccms-components';

angular.module('app', [ccmsComponents]);
```

#### 友情提示
ccms模块产品请将组件库手动设置到webpack的externals中，避免重复打包

```js
externals: {'ccms-components': '\'ccms.components\''}
```

#### 开发规范
1. 所有组件模板以.tpl.html为后缀名,区别于业务模板的.html后缀,便于打包时对组件跟业务模板做差异化处理.

组件库使用 [Phabricator 系统](http://phabricator.shuyun.com/) 做 code view，工作流程可以参考 [Phabricator 新用户指南](https://gist.github.com/arzyu/0deeac12b8cc4db3b6e0)。

## 运行文档服务

文档使用 [jekyll] 生成，这是使用 [ruby] 脚本编写的一个工具，为了运行 [jekyll] 你需要安装 [ruby] 环境。

推荐使用 [rvm] 管理 [ruby] 版本, 类似于用 [nvm] 管理 [nodejs] 版本。

```bash
# 安装 rvm 及 ruby
curl -L https://get.rvm.io | bash -s stable --autolibs=enabled --ruby

# 首次设置 ruby 版本
rvm use 2.3.0 --default --create

# 安装 bundler，用于管理依赖
gem install bundler

# 在 CCMS_Components 项目根目录运行 bundler install 即可安装 Gemfile 指定的依赖（包括 jekyll）
bundler install

# 在 CCMS_Components 项目根目录运行文档服务，http://localhost:3001/docs/
jekyll serve
```


[jekyll]: https://jekyllrb.com/
[ruby]: https://www.ruby-lang.org/
[rvm]: https://github.com/rvm/rvm
[nvm]: https://github.com/creationix/nvm
[nodejs]: https://nodejs.org/

[jekyll]: https://jekyllrb.com/
[ruby]: https://www.ruby-lang.org/
[rvm]: https://github.com/rvm/rvm
[nvm]: https://github.com/creationix/nvm
[nodejs]: https://nodejs.org/

