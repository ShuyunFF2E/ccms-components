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
	exit 1
fi

# step 1, 同步 dist 目录
rsync --recursive --update --delete-excluded --progress \
	dist "$(< dev-server-path)"


# step 2, 更新 master 分支

IFS=':' read -ra params <<< "$(< dev-server-path)"

dev_server=${params[0]}
ccms_path=${params[1]}

ssh $dev_server "sh" <<- EOT
cd $ccms_path
git checkout master
git fetch --prune
git reset origin/master --hard
EOT

