#!/bin/bash

set -e

function release_production() {
	version_category=$1
	prepare_cmd="$PWD/scripts/build-prepare-production.sh $version_category"
	version_tag="$($prepare_cmd | tail -1)"

	printf "\n=> npm run build -- master\n\n"
	$PWD/scripts/build.sh master

	printf "\n=> npm run publish:package\n\n"
	$PWD/scripts/publish-package.sh

	printf "\n\n=> npm run publish:docs -- $version_tag\n\n"
	$PWD/scripts/publish-docs.sh $version_tag
}

release_production $@

