#!/bin/bash

set -e

function publish_docs() {
	if [[ -n "$(git status --porcelain)" ]]; then
		echo "Working tree *NOT* clean."
		exit 1
	fi

	current_branch="$(git symbolic-ref --short -q HEAD)"
	current_branch=${current_branch:-dev}

	version_tag=$1
	tmp_branch="docs-$1"

	git fetch --prune
	git checkout -b $tmp_branch $version_tag

	if [[ ! -d docs/_gh_pages ]]; then
		jekyll build --source docs
	fi

	git add -f docs/_gh_pages
	git commit -m "chore(docs): generate documents"
	git subtree split --prefix=docs/_gh_pages -b gh-pages
	git push -f origin gh-pages:gh-pages
	git reset $current_branch --hard
	git branch -D gh-pages $tmp_branch
}

if [[ $# < 1 ]]; then
	echo "Missing parameters: <version_tag>."
	exit 1
else
	publish_docs $@
fi

