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

function release_production() {
	version=$1

	# release new version
	git checkout dev
	git pull --prune
	git checkout master
	git reset origin/master --hard
	git merge dev --no-ff -m "chore(release): Merge branch 'dev' into master"
	new_version=$(npm version $version -m "chore(release): v%s")
	git checkout dev
	git rebase master
	git push origin master dev $new_version

	# release docs
	if [[ ! -d docs/_gh_pages ]]; then
		jekyll build --source docs
	fi
	git add -f docs/_gh_pages
	git commit -m "chore(docs): generate documents"
	git subtree split --prefix=docs/_gh_pages -b gh-pages
	git push -f origin gh-pages:gh-pages
	git branch -D gh-pages
	git reset $new_version --hard

	build && publish
}

function release_branch() {
	version="$1"
	branch=$2

	git fetch --prune
	git checkout origin/$branch
	test_version=$(npm version $version -m "chore(release): v%s")
	git push origin $test_version

	build && publish

	git checkout dev
}

function release() {
	version=""
	branch=""
	while [[ "$1" != "" ]]; do
		case $1 in
			major | minor | patch )
				version="$1"
				;;
			--branch )
				branch="$2"
				if [[ "$branch" == "" ]]; then
					echo "Missing parameter <BRANCH-NAME> for --branch"
					exit 1;
				fi
				shift
				;;
			* )
				echo "Unknow parameter \"$1\""
				exit 1
				;;
		esac
		shift
	done

	if [[ "$version" == "" ]]; then
		echo "Missing parameter <VERSION>: major | minor | patch"
		exit 1
	fi

	if [[ "$branch" == "" ]]; then
		release_production $version
	else
		release_branch "pre$version" $branch
	fi
}


# cd ccms-components/
cd "$(dirname "$0")/.."

if [[ $# < 1 ]]; then
	echo "Missing parameters, read the document for details:"
	echo
	echo -e "\thttps://github.com/ShuyunFF2E/ccms-components#发布脚本"
	echo
	exit 0
else
	release $@
fi

