#!/usr/bin/env bash
NODE_ENV=production webpack --config webpack-build.config.js
cp package.json dist
echo "require('./ccms_components.js');
module.exports = 'ccms.components';" > dist/index.js
npm publish dist
cnpm sync ccms-components
