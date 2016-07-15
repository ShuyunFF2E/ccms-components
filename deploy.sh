#!/usr/bin/env bash
jekyll build
cp -R _gh_pages/* ./
#路径替换
#sed -i -e 's/"\/docs/"\/ccms-components/g' index.html
git add ./*
