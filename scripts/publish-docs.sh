#!/bin/bash

set -e

function publish_docs() {
	if [[ -n "$(git status --porcelain)" ]]; then
		echo "Working tree *NOT* clean."
		exit 1
	fi

	current_branch="$(git symbolic-ref --short -q HEAD)"
	current_branch=${current_branch:-dev}

	version_tag=${1:-"$(git tag | tail -1)"}
	tmp_branch="docs-$version_tag"

	git fetch --prune
	git checkout -B $tmp_branch $version_tag

	if [[ ! -d docs/_gh_pages ]]; then
		jekyll build --source docs
	fi

	git add -f docs/_gh_pages
	git commit -m "chore(docs): generate documents"
	if [[ -n "$(git rev-parse --verify --quiet gh-pages)" ]]; then
		git branch -D gh-pages
	fi
	git subtree split --prefix=docs/_gh_pages -b gh-pages
	git push -f origin gh-pages:gh-pages
	git checkout $current_branch
	git branch -D gh-pages $tmp_branch
}

publish_docs $@

