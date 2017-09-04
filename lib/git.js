const execa = require('execa');

async function moveFile(file, dest, dry) {
  const stdout = await execa.stdout(
    'git',
    ['mv', dry ? '-n' : '', file, dest].filter(v => !!v)
  );
  return stdout;
}

async function findFilesToMove(query, dest) {
  const r = /^Renaming (.+) to (.+)$/i;

  const stdout = await moveFile(query, dest, true);
  return stdout
    .split('\n')
    .map(v => v.trim())
    .filter(v => !!v)
    .filter(s => s.startsWith('Renaming'))
    .reduce((obj, mv, i) => {
      const [, prevPath, nextPath] = mv.match(r);
      obj[prevPath] = nextPath;
      obj[i] = [prevPath, nextPath];
      return obj;
    }, []);
}

moveFile.findFilesToMove = findFilesToMove;

module.exports = moveFile;
