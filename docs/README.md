# 运行文档服务

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
