#!/usr/bin/env bash
cnpm i
NODE_ENV=production webpack --config webpack-build.config.js
cp package.json dist
cp -R src/components/styles dist/scss
echo "require('./ccms-components.css');require('./ccms-components.js');
module.exports = 'ccms.components';" > dist/index.js
npm publish dist
cnpm sync ccms-components
