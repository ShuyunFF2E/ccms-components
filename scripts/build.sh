#! /bin/bash

set -e

function build() {
	git_revision=$1

	if [[ -n "$git_revision" ]]; then
		current_branch="$(git symbolic-ref --short -q HEAD)"
		current_branch=${current_branch:-dev}

		git checkout $git_revision
	fi

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

	if [[ -n "$current_branch" ]]; then
		git checkout $current_branch
	fi
}

build $@

