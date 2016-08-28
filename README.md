# Electron + Angular template

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Install dependencies

Run `npm install && bower install`

Run `cd app && npm install` (dependencies used in electron)

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Electron commands

`npm start`: the same as "grunt serve"

`npm run rebuild`: to solve some problems in deploy with sqlite3 module and nodejs

`npm run build-all`: build electron executables in dist-electron folder

`npm run installer`: build electron executables in release folder
