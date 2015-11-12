#!/bin/bash

echo "Building Free Water Project.";
cd ./client/ && npm run build && cd ../;

echo "Deleting files in ./www";
rm -rf ./www/*;

echo "Copying files from ./client/dist to ./www";
cp -r ./client/dist/* ./www/ && echo 'bug: removing web-animations.min.js.gz for error' && rm ./www/bower_components/web-animations-js/web-animations.min.js.gz
