#!/usr/bin/env node

const { runTui } = require('./tui');

if (require.main === module) {
  runTui().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = runTui;
