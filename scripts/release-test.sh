#!/bin/bash

set -e

function release_test() {
	version_category=$1
	branch=$2

	$PWD/scripts/build-prepare-test.sh $version_category $branch

	echo "\n=> npm run build -- $branch\n"
	$PWD/scripts/build.sh $branch

	echo "\n=> npm run publish:package\n"
	$PWD/scripts/publish-package.sh
}

release_test $@

