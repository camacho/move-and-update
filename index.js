const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdirp = require('mkdirp-promise');
const execa = require('execa');
const glob = require('glob-promise');
const resolveBin = require('resolve-bin');

const relTransform = require.resolve(
  'refactoring-codemods/lib/transformers/import-relative-transform.js'
);

const declTransform = require.resolve(
  'refactoring-codemods/lib/transformers/import-declaration-transform.js'
);

const jscodeshift = resolveBin.sync('jscodeshift');

async function relocate(prevPath, nextPath, dry, processOptions) {
  try {
    await execa(
      'git',
      ['mv', dry ? '-n' : '', prevPath, nextPath].filter(v => !!v),
      processOptions
    );
  } catch (error) {
    if (!dry) await promisify(fs.rename)(prevPath, nextPath);
  }
}

module.exports = async function moveFile(prevPath, nextPath, { dry }) {
  // Add options here for child processes
  const processOptions = {};

  // Ensure the directory exists
  if (!dry) await mkdirp(path.dirname(nextPath));

  // Move the file
  await relocate(prevPath, nextPath, dry, processOptions);

  // Check if file is a snapshot and return early if so
  if (path.extname(nextPath) === '.snap') return;

  // Check if test file and return early if so
  if (/\.(spec|test)\.js$/.test(nextPath)) return;

  await execa(
    jscodeshift,
    [
      dry ? '-d' : '',
      '-t',
      relTransform,
      nextPath,
      `--prevFilePath=${prevPath}`,
      `--nextFilePath=${nextPath}`,
    ].filter(v => !!v),
    processOptions
  );

  // Figure out all the files and directories we want to run this transform on
  // IMPORTANT - don't run it on node_modules
  const topLevel = await glob('*', { dot: true });
  const targets = topLevel.filter(v => v !== 'node_modules');

  await execa(
    jscodeshift,
    [
      dry ? '-d' : '',
      '-t',
      declTransform,
      ...targets,
      `--prevFilePath=${prevPath}`,
      `--nextFilePath=${nextPath}`,
    ].filter(v => !!v),
    processOptions
  );
};
