#!/bin/bash

set -e

function release_test() {
	version_category=$1
	branch=$2
	$PWD/scripts/build-prepare-test.sh $version_category $branch
	$PWD/scripts/build.sh $branch
	$PWD/scripts/publish-package.sh
}

release_test $@

