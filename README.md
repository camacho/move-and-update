# Move and Update

This utility helps move files around inside a codebase with `git` and update all references to those files.

It's built on top of [refactoring-codemods](https://github.com/jurassix/refactoring-codemods) and FB's [jscodeshift](https://github.com/facebook/jscodeshift) codemod toolkit.

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Requirements](#requirements)
- [Getting started](#getting-started)
  * [Install](#install)
  * [Command Line](#command-line)
  * [Module](#module)
- [Options](#options)
  * [CLI](#cli)
<!-- AUTO-GENERATED-CONTENT:END -->

## Requirements
<!-- AUTO-GENERATED-CONTENT:START (ENGINES) -->
* **node**: >=8.0.0
<!-- AUTO-GENERATED-CONTENT:END -->

## Getting started

### Install
<!-- AUTO-GENERATED-CONTENT:START (INSTALL:flags=["-D"]) -->
```sh
yarn install -D move-and-update
```
<!-- AUTO-GENERATED-CONTENT:END -->

### Command Line

This module provides a simple CLI:

```sh
./node_modules/.bin/move-and-update --help
```

If combined with [Yarn](https://yarnpkg.com/), it can be run as:

```sh
yarn move-and-update --help
```

It can also be used as part of an [npm script](https://docs.npmjs.com/misc/scripts):

```json
{
  "scripts": {
    "move": "move-and-update"
  },
  "devDependencies": {
    "move-and-update": "latest"
  }
}
```

```sh
yarn move -- lib/state/**/* lib/redux
```

**Note** this takes advantage of the [run-script](https://docs.npmjs.com/cli/run-script) capability of passing arguments to the script by using `--`.

### Module

The module exports a default `move` function that takes a file path, a destination path, and a [map of options](#options). The function returns a promise.

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const move = require('move-and-update');

const path = require('path');

const file = path.resolve(process.cwd(), 'src', 'styles', 'styles.css');
const dest = path.resolve(process.cwd(), 'src', 'styles.css');

const options = { dry: true };

move(file, dest, options).then(
  () => console.log('Success'),
  err => console.err(err)
);
```
<!-- AUTO-GENERATED-CONTENT:END -->


## Options

There are two option: **dry**, which is defaultly **false** and **rel** which is defaultly './'

Options are expected to be passed in as a map:

```js
const move = require('move-and-update');
...
const options = { dry: true, rel: './src' };
move(file, dest, options);
```

### CLI

| **Option** | **Description** | **Default** |
| -----------| --------------- | ----------- |
| `-d` | Whether to run all processes in `dry` mode | false |
| `-r` | Directory to be used to resolve the relative path of the file before moving | './'
| `-h` | Print help menu | |


You can also see the available options in the terminal by running:

```
yarn move-and-update --help
```
