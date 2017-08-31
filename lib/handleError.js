function logErrorAndTerminate(spinner, err) {
  if (!err) {
    spinner.fail('Something went wrong!');
    process.exit(1);
  }

  spinner.fail(err.stderr || err.stdout || err);
  process.exit(err.code || 1);
}

module.exports = spinner => err => logErrorAndTerminate(spinner, err);
