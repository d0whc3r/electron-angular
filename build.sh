#!/bin/bash
DISTDIR="dist"
jquery="jquery.min.js"
cd $DISTDIR
mkdir -p bower_components/jquery/dist/
cp ../bower_components/jquery/dist/$jquery bower_components/jquery/dist/$jquery
cp ../app/package.json .
cp ../app/index.js .
