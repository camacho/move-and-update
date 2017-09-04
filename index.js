const moveFile = require('./lib/git');
const updateReferences = require('./lib/mods');

async function moveAndUpdate(file, dest, dry) {
  await moveFile(file, dest, dry);
  await updateReferences(file, dest, dry);
}

module.exports = moveAndUpdate;
