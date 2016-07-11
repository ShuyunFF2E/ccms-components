#! /bin/bash

set -e

function build() {
	# install dependencies
	npm install --registry=https://registry.npm.taobao.org

	# webpack build
	NODE_ENV=production webpack --config webpack-build.config.js

	# copy files
	#cp package.json dist
	cp -rv src/components/styles dist/scss

	# create dist/index.js
	cat > dist/index.js <<- EOT
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

function copy-dist() {
	if [ ! -f dev-server-path ]; then
		echo "user@ip:/path/to/ccms-components" > dev-server-path
		echo
		echo "EDIT ccms-components/dev-server-path"
		echo "THEN RUN: \"$0 --copy-dist\" to continue"
		echo
	else
		rsync --recursive --update --delete-excluded --progress dist "$(<dev-server-path)"
	fi
}

function release() {
	version=""
	while [[ "$1" != "" ]]; do
		case $1 in
			--major | --minor | --patch )
				version="${1:2}"
				;;
		esac
		shift
	done

	# release new version
	git checkout dev
	git pull --prune
	git checkout master
	git merge dev --no-ff -m "Merge branch 'dev'"
	new_version=$(npm version $version -m "release: v%s")
	git checkout dev
	git rebase master
	git push origin master dev $new_version

	build && publish && copy-dist
}


# cd ccms-components/
cd "$(dirname "$0")/.."

release_args=()

while [[ "$1" != "" ]]; do
	case $1 in
		--copy-dist )
			copy-dist
			exit
			;;
		--major | --minor | --patch )
			release_args+=($1)
			;;
		* )
			echo "Unknow parameter \"$1\""
			exit
			;;
	esac
	shift
done

if [[ ${#release_args[@]} > 0 ]]; then
	release $release_args
else
	echo "Missing version parameter: --major | --minor | --patch"
fi

