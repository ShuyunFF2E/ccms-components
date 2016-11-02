#!/bin/bash

set -e

function release_test() {
	version_category=$1
	branch=$2

	$PWD/scripts/build-prepare-test.sh $version_category $branch

	printf "\n=> npm run build -- $branch\n\n"
	$PWD/scripts/build.sh $branch

	printf "\n=> npm run publish:package\n\n"
	$PWD/scripts/publish-package.sh
}

release_test $@

