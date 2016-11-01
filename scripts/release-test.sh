#!/bin/bash

set -e

function release_test() {
	$PWD/scripts/build-prepare-test.sh $1 $2
	$PWD/scripts/build.sh
	$PWD/scripts/publish-package.sh
}

release_test $@

