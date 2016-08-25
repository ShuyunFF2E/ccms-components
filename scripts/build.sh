#! /bin/bash

set -e

# install dependencies
npm install --registry=https://registry.npm.taobao.org

# webpack build
NODE_ENV=production webpack --config webpack-build.config.js

# copy files
cp package.json dist
cp -rv src/components/styles dist/scss

# create dist/index.js
cat > dist/index.js <<- EOT
require('./ccms-components.css');
require('./ccms-components.js');
module.exports = 'ccms.components';
EOT

