#! /bin/bash

set -e

function build() {
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
}

function publish() {
	# publish to npmjs.org
	npm publish dist

	# cnpm sync ccms-components
	curl -X PUT https://npm.taobao.org/sync/ccms-components
}

function release() {
	version=""
	while [[ "$1" != "" ]]; do
		case $1 in
			--major | --minor | --patch )
				version="${1:2}"
				;;
			* )
				echo "Unknow parameter \"$1\""
				exit 1
				;;
		esac
		shift
	done

	if [[ "$version" == "" ]]; then
		echo "Missing version parameter: --major | --minor | --patch"
		exit 1
	fi

	# release new version
	git checkout dev
	git pull --prune
	git checkout master
	git merge dev --no-ff -m "chore(release): Merge branch 'dev' into master"
	new_version=$(npm version $version -m "chore(release): v%s")
	git checkout dev
	git rebase master
	git push origin master dev $new_version

	build && publish
}


# cd ccms-components/
cd "$(dirname "$0")/.."

release $@

