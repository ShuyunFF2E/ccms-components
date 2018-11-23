#! /bin/bash

set -e

function release() {
	version_category=""
	branch=""
	while [[ -n "$1" ]]; do
		case $1 in
			major | minor | patch )
				version_category="$1"
				;;
			--branch )
				branch="$2"
				if [[ "$branch" == "" ]]; then
					echo "Missing parameter: <branch_name> for --branch"
					exit 1;
				fi
				shift
				;;
			* )
				echo "Unknow parameter \"$1\""
				exit 1
				;;
		esac
		shift
	done

	if [[ "$version_category" == "" ]]; then
		echo "Missing parameter: <version_category: major | minor | patch>"
		exit 1
	fi

	if [[ -z "$branch" ]]; then
		$PWD/scripts/release-production.sh $version_category
	else
		$PWD/scripts/release-test.sh $version_category $branch
	fi
}


# cd ccms-components/
cd "$(dirname "$0")/.."

release $@

