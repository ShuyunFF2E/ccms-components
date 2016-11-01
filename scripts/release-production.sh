#!/bin/bash

set -e

function release_production() {
	release_version="$($PWD/scripts/build-prepare-production.sh $1)"
	$PWD/scripts/build.sh
	$PWD/scripts/publish-package.sh
	$PWD/scripts/publish-docs.sh $release_version
}

release_production $@

