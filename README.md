# CCMS Components

1. 所有组件模板以.tpl.html为后缀名,区别于业务模板的.html后缀,便于打包时对组件跟业务模板做差异化处理.
2. 当某个组件出现多个模板时,统一归类到tpls文件夹中,单一模板放在外层目录即可.
3. 每个组件目录均包含一个index.js入口,其他模块则以驼峰大写方式命名,参见grid组件目录组织方式.如果组件简单不需要分层(如filter),则直接在index.js中完成主体逻辑即可.

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

## babel5 -> babel6升级指南

```bash
npm uninstall babel -g
npm i babel-cli -g
```
删除项目node_modules文件目录

```bash
npm i
```

## How To Use

1. **Recommend**

```bash
npm install --save ccms_components
```

2. Deprecated

```bash
npm install --save git+ssh://git@git.yunat.com:7999/ffe/ccms_components.git
```
需要先配好[git ssh](https://git-scm.com/book/zh/v1/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5)

ccms模块产品请将依赖加入到 devDependencies 里,便于自己打包

```js
externals: {'ccms_components': '\'ccms.components\''}
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

