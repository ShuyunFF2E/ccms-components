#!/bin/bash

set -e

# publish to npmjs.org
npm publish dist

# cnpm sync ccms-components
curl -X PUT https://npm.taobao.org/sync/ccms-components

