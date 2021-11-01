#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const inquirer = require('inquirer');
const readline = require('readline');
const {execSync} = require('child_process');
const packageJson = require('../package.json');
const config = require('./config');
const header = require('./header');
const output = require('./logger');

const log = {...output()};

const requiredVersion = packageJson.engines.node;

const cliHeader = () => {
  output('');
  log.notice(chalk`{magenta cli} v${packageJson.version}`);
};

const processContribSelections = (command) => {
  cliHeader();
  log.info('Running Command:');
  log.info(chalk`  name: {magenta ${command}}`);
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.close();

    execSync(`yarn ${command}`, {stdio: 'inherit'});
    process.exit(0);
  } catch (err) {
    log.error(err.message, err);
    process.exit(1);
  }
};

const longestLen = (arr) => arr.reduce((a, b) => Math.max(a, b.name.length), 0);

const showContribWizard = () => {
  output(chalk`Welcome to the LRE Water Developer Console!\n`);

  // Ask contributors to choose a run-script command
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'command',
        message: 'Select a command:',
        choices: [
          ...config.commands.map((x) => ({
            name: `${x.name.padEnd(longestLen(config.commands), ' ')} - ${
              x.description
            }`,
            value: x.name,
            short: x.name,
          })),
        ],
      },
    ])
    .then(async (answers) => {
      processContribSelections(answers.command);
    });
};
output(header);

if (!semver.satisfies(process.version, requiredVersion)) {
  output(
    chalk.red(`\nError: Minimum Node.js version not met.`) +
      chalk.yellow(
        `\nYou are using Node.js ${process.version}, Requirement: Node.js ${requiredVersion}.` +
          `\n\nPlease visit https://nodejs.org to update your Node.js version.\n`
      )
  );
  process.exit(1);
}

showContribWizard();
