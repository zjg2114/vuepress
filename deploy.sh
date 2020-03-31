#!/usr/bin/env sh

# 终止一个错误
set -e

# 构建
yarn build

# 进入生成的构建文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果你想要部署到 https://<USERNAME>.github.io
git push -f git@github.com:zjg2114/zjg2114.github.io.git master

cd -