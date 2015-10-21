#!/bin/bash

echo "Building Web Starter Kit Project.";
#cd ./web-starter-kit/ && gulp && cd ../;
# cd ./map-app/ && cd ../;
cd ./wsk-app/ && gulp && cd ../;

echo "Deleting files in ./www";
rm -rf ./www/*;

echo "Copying files from ./web-starter-kit/dist to ./www";
# cp -r ./web-starter-kit/dist/* ./www/;
# cp -r ./map-app/* ./www/;
cp -r ./wsk-app/dist/* ./www/ && echo 'bug: removing web-animations.min.js.gz for error' && rm ./www/bower_components/web-animations-js/web-animations.min.js.gz
