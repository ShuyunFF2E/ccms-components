#!/bin/bash

set -e

function build_prepare_production() {
	if [[ -n "$(git status --porcelain)" ]]; then
		echo "Working tree *NOT* clean. Please stash/commit your changes before any operations."
		exit 1
	fi

	current_branch="$(git symbolic-ref --short -q HEAD)"
	current_branch=${current_branch:-dev}

	version_category=$1
	if [[ -z "$version_category" ]]; then
		echo "Missing parameter: <version_category: major | minor | patch>"
		exit 1
	fi

	git checkout dev
	git pull --prune
	git checkout master
	git reset origin/master --hard
	git merge dev --no-ff -m "chore(release): Merge branch 'dev' into master"

	version_tag=$(npm version $version_category -m "chore(release): v%s")

	git checkout dev
	git rebase master
	git push origin dev master $version_tag
	git checkout $current_branch
}

build_prepare_production $@

