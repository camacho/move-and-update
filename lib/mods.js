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

async function updateReferencesOnMovedFile(prevPath, nextPath, dry) {
  await execa(
    jscodeshift,
    [
      dry ? '-d' : '',
      '-t',
      relTransform,
      nextPath,
      `--prevFilePath=${prevPath}`,
      `--nextFilePath=${nextPath}`,
    ].filter(v => !!v)
  );
}

async function updateReferencesToMovedFile(prevPath, nextPath, dry) {
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
    ].filter(v => !!v)
  );
}

async function updateReferences(prevPath, nextPath, dry) {
  await updateReferencesOnMovedFile(prevPath, nextPath, dry);
  await updateReferencesToMovedFile(prevPath, nextPath, dry);
}

updateReferences.updateReferencesOnMovedFile = updateReferencesOnMovedFile;
updateReferences.updateReferencesToMovedFile = updateReferencesToMovedFile;

module.exports = updateReferences;
