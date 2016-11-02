#!/bin/bash

set -e

function release_production() {
	version_category=$1
	prepare_cmd="$PWD/scripts/build-prepare-production.sh $version_category"
	release_version="$($prepare_cmd | tail -1)"
	$PWD/scripts/build.sh master
	$PWD/scripts/publish-package.sh
	$PWD/scripts/publish-docs.sh $release_version
}

release_production $@

