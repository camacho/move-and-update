#!/usr/bin/env node

// Parse the arguments
// first argument is the file or directory or glob to be moved
// second argument is the destination for all the files
// In time, 3rd argument could be a location transformation?
const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const yargs = require('yargs');
const glob = require('glob-promise');
const ora = require('ora');
const isDirectory = require('is-directory');

const handleError = require('../lib/handleError');
const moveFile = require('../');
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
    r: {
      alias: 'rel',
      type: 'string',
      force: false,
      description:
        "path that found files' new path should be determined in relation to",
      default: './',
    },
  })
  .demandCommand(2)
  .help().argv;

async function execute(spinner, query, dest, options) {
  spinner.text = 'Finding files to move';

  const destDir = path.resolve(process.cwd(), dest);

  let files;

  if (fs.existsSync(query)) {
    if (isDirectory.sync(query)) {
      // Moving an entire directory
      files = await glob('${query}/**');
    } else {
      // If this is a file, don't use glob
      files = [query];
    }
  } else {
    files = await glob(query, { nodir: true });
  }

  spinner.text = `Preparing to move ${files.length} file${files.length === 1
    ? ''
    : 's'}`;

  for (let file of files) {
    const currentPath = path.resolve(path.resolve(process.cwd(), cwd), file);
    const destPath = path.join(destDir, path.relative(options.rel, file));

    spinner.text = `Moving ${chalk.bold(
      path.relative(cwd, currentPath)
    )} to ${chalk.bold(path.relative(cwd, destPath))}`;

    await moveFile(currentPath, destPath, options);
  }

  spinner.succeed(
    `${files.length} file${files.length === 1 ? '' : 's'} moved to ${destDir}`
  );
}

const spinner = ora().start();
execute(spinner, ...options._, options).catch(handleError(spinner));
