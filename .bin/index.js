#!/usr/bin/env node

// Parse the arguments
// first argument is the file or directory or glob to be moved
// second argument is the destination for all the files
// In time, 3rd argument could be a location transformation?
const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const yargs = require('yargs');
const ora = require('ora');

const { findFilesToMove } = require('../lib/git');
const handleError = require('../lib/handleError');
const moveFileAndUpdate = require('../');

const cwd = process.cwd();

const options = yargs
  .options({
    d: {
      alias: 'dry',
      type: 'boolean',
      description: 'prevent any files from being moved or changed',
      force: false,
      default: false,
    },
  })
  .demandCommand(2)
  .help().argv;

async function execute(spinner, argv, dry) {
  const [dest, ...files] = argv.reverse().map(f => path.resolve(cwd, f));
  spinner.text = `Finding files to move`;
  const moveFiles = await findFilesToMove(files, dest);
  spinner.text = `Preparing to move ${moveFiles.length} file${moveFiles.length ===
  1
    ? ''
    : 's'}`;

  for (let [prev, next] of moveFiles) {
    const currentPath = path.resolve(cwd, prev);
    const destPath = path.resolve(cwd, next);

    spinner.text = `Moving ${chalk.bold(
      path.relative(cwd, currentPath)
    )} to ${chalk.bold(path.relative(cwd, destPath))}`;

    await moveFileAndUpdate(currentPath, destPath, dry);
  }

  spinner.succeed(
    `${moveFiles.length} file${moveFiles.length === 1 ? '' : 's'} moved`
  );
}

const spinner = ora().start();
execute(spinner, options._, options.dry).catch(handleError(spinner));
