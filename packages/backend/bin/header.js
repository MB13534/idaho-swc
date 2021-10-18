const chalk = require('chalk');

const packageJson = require('../package.json');

const {version} = packageJson;

const paddedVersion = ` v${version}`.padStart(20, '─');

const types = {
  ASCII_HEADER: chalk`
{gray ╭─────────────────────────────────────────────────────────────╮}
{gray │}{bold   _      _____  ______}{cyan __          __  _______ ______ _____   }{gray │}
{gray │}{bold  | |    |  __ \\|  ____}{cyan \\ \\        / /\\|__   __|  ____|  __ \\  }{gray │}
{gray │}{bold  | |    | |__) | |__   }{cyan \\ \\  /\\  / /  \\  | |  | |__  | |__) | }{gray │}
{gray │}{bold  | |    |  _  /|  __|   }{cyan \\ \\/  \\/ / /\\ \\ | |  |  __| |  _  /  }{gray │}
{gray │}{bold  | |____| | \\ \\| |____   }{cyan \\  /\\  / ____ \\| |  | |____| | \\ \\  }{gray │}
{gray │}{bold  |______|_|  \\_\\______|   }{cyan \\/  \\/_/    \\_\\_|  |______|_|  \\_\\ }{gray │}
{gray ╰───────────────────────────────────────${paddedVersion} ─╯}
`,
};

module.exports = types.ASCII_HEADER;
