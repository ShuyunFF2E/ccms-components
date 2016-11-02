#!/bin/bash

set -e

function release_production() {
	version_category=$1
	prepare_cmd="$PWD/scripts/build-prepare-production.sh $version_category"
	version_tag="$($prepare_cmd | tail -1)"

	echo "\n=> npm run build -- master\n"
	$PWD/scripts/build.sh master

	echo "\n=> npm run publish:package\n"
	$PWD/scripts/publish-package.sh

	echo "\n=> npm run publish:docs -- $version_tag\n"
	$PWD/scripts/publish-docs.sh $version_tag
}

release_production $@

