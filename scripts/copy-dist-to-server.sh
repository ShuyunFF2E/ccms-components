#! /bin/bash

set -e

cd "$(dirname "$0")/.."

default_server_path="user@ip:/path/to/ccms-components"

if [ ! -f dev-server-path ]; then
	echo $default_server_path > dev-server-path
fi

if [[ "$(< dev-server-path)" == "$default_server_path" ]]; then
	echo
	echo "==> EDIT ccms-components/dev-server-path"
	echo "==> THEN RUN: \"$0\" to continue"
	echo
else
	rsync --recursive --update --delete-excluded --progress \
		dist "$(< dev-server-path)"
fi

