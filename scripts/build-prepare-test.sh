#!/bin/bash

set -e

function build_prepare_test() {
	if [[ -n "$(git status --porcelain)" ]]; then
		echo "Working tree *NOT* clean."
		exit 1
	fi

	current_branch="$(git symbolic-ref --short -q HEAD)"
	current_branch=${current_branch:-dev}

	version_category="$1"
	if [[ -z "$version_category" ]]; then
		echo "Missing parameter: <version_category: major | minor | patch>"
		exit 1
	fi

	test_branch=$2
	if [[ -z "$test_branch" ]]; then
		echo "Missing parameter: <branch_name>"
		exit 1
	fi

	git fetch --prune
	git checkout -B $test_branch origin/$test_branch

	version_tag=$(npm version pre$version_category -m "chore(release): v%s")

	git push origin $test_branch $version_tag
	git checkout $current_branch

	echo $version_tag
}

build_prepare_test $@

