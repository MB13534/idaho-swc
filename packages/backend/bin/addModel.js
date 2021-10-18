#!/usr/bin/env node

require('dotenv').config();
const {Observable} = require('rxjs');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const inflector = require('inflected');
const inquirer = require('inquirer');
const packageJson = require('../package.json');
const header = require('./header');
const output = require('./logger');
const db = require('./db');
const url = require('url');

const log = {...output()};

const requiredVersion = packageJson.engines.node;
let appSchema = 'app';
let defaultDisplayName = 'name';
let dbTableName = null;
let emitter = null;

function main() {
  output(chalk`To add a new model, answer the following:\n`);

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Model Name (e.g. Contacts, People, WellReadings):',
        validate: (name) => {
          if (!name) return 'Model Name is required.';

          if (modelExists(name)) {
            return chalk`Model {magenta ${name}} already exists. Please choose a different name.`;
          }

          if (routeExists(name)) {
            return chalk`Route {magenta ${name}} already exists. Please choose a different name.`;
          }

          if (configExists(name)) {
            return chalk`Config {magenta ${name}} already exists. Please choose a different name.`;
          }

          return true;
        },
      },
    ])
    .then((answers) => {
      // replace spaces with underscores
      answers.name = answers.name.replace(/\s/g, '_');
      // convert to UpperCamelCase
      answers.name = inflector.camelize(answers.name);

      if (!isPlural(answers.name)) {
        const prompts = Observable.create(function (e) {
          emitter = e;
          emitter.next({
            type: 'confirm',
            name: 'pluralizeName',
            message: chalk`Pluralize name? ({red ${
              answers.name
            }} → {green ${inflector.pluralize(answers.name)}})?`,
          });
        });

        inquirer.prompt(prompts).ui.process.subscribe((question) => {
          if (question.answer === true) {
            answers.name = inflector.pluralize(answers.name);

            let hasErrors = false;
            if (modelExists(answers.name)) {
              hasErrors = true;
              log.error(chalk`Model {magenta ${answers.name}} already exists.`);
            }

            if (routeExists(answers.name)) {
              hasErrors = true;
              log.error(chalk`Route {magenta ${answers.name}} already exists.`);
            }

            if (!hasErrors) {
              doCreateTablePrompt(emitter, answers);
            } else {
              log.notice('Aborting...');
              emitter.complete();
            }
          } else {
            doCreateTablePrompt(emitter, answers);
          }
        });
      } else {
        doCreateTablePrompt(emitter, answers);
      }
    });
}

function doCreateTablePrompt(emitter, answers) {
  dbTableName = inflector.tableize(answers.name);
  const fullTableName = `${appSchema}.${dbTableName}`;
  let myEmitter = null;

  const prompts = Observable.create(function (e) {
    myEmitter = e;
    myEmitter.next({
      type: 'input',
      name: 'displayName',
      message: chalk`Column for display name:`,
      default: defaultDisplayName,
    });
  });

  inquirer.prompt(prompts).ui.process.subscribe(async (question) => {
    defaultDisplayName = question.answer;

    let tableNameEmitter = null;

    const prompts = Observable.create(function (e) {
      tableNameEmitter = e;
      tableNameEmitter.next({
        type: 'input',
        name: 'tableName',
        message: chalk`Use database table name:`,
        default: fullTableName,
        validate: (name) => {
          if (!name) {
            return 'Database table name is required.';
          }
          return true;
        },
      });
    });

    inquirer.prompt(prompts).ui.process.subscribe(async (question) => {
      dbTableName = question.answer;

      await createTable(dbTableName);
      createModel(answers.name);
      createRoute(answers.name);
      createConfig(answers.name);
      done(answers.name);

      await tableNameEmitter.complete();
      await myEmitter.complete();
      if (emitter) await emitter.complete();

      process.exit(0);
    });
  });
}

async function createTable(name) {
  let exists;
  const {sequelize} = await db.connect();
  let fullTableName = '';

  if (name.indexOf('.') === -1) {
    fullTableName = `${appSchema}.${name}`;
  } else {
    fullTableName = name;
    name = name.split('.')[1];
  }

  let [schema, table] = fullTableName.split('.');

  if (!table) {
    table = schema;
  } else {
    appSchema = schema;
  }

  const requiredCrudColumns = [
    'id',
    'parent_id',
    'former_parent_id',
    'status_id',
    'created_by',
    'created_at',
    'updated_by',
    'updated_at',
    'deleted_by',
    'deleted_at',
  ];

  try {
    log.info(chalk`Checking if table exists: {magenta ${fullTableName}}`);

    await sequelize.query(`SELECT 1 FROM ${fullTableName} LIMIT 0;`);

    exists = true;
  } catch (err) {
    exists = false;
  }

  if (exists) {
    log.notice('Table already exists, checking required columns.');

    const [results] = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = '${appSchema}' AND table_name = '${table}'`
    );

    const columns = results.map((x) => x.column_name);

    let hasAllRequiredColumns = true;

    requiredCrudColumns.forEach((requiredColumn) => {
      if (!columns.includes(requiredColumn)) {
        log.notice(
          chalk`Adding missing required column: {magenta ${requiredColumn}}`
        );
        hasAllRequiredColumns = false;
      }
    });

    if (hasAllRequiredColumns) {
      log.success('Table already had all required crud columns.');
    } else {
      const crudifyScript = path.resolve(
        __dirname,
        '../core/models/schema',
        '_crudify_table.sql'
      );

      let sql = fs.readFileSync(crudifyScript, {
        encoding: 'utf8',
        flag: 'r',
      });

      sql = sql.replace(/TOKEN_SCHEMA/g, appSchema);
      sql = sql.replace(/TOKEN_TABLE_NAME/g, table);
      sql = sql.replace(/TOKEN_DB_USER/g, process.env.PG_USERNAME);

      const commands = sql.split('-- SPLITTER: DO NOT REMOVE --');

      let hasErrors = false;
      for (const cmd of commands) {
        try {
          await sequelize.query(cmd);
        } catch (err) {
          hasErrors = true;
          log.warning(err);
        }
      }

      if (hasErrors) return false;

      log.success('Crud fields added to table.');
    }

    // add the display name column if it doesnt exist
    if (!columns.includes(defaultDisplayName)) {
      const displayNameColumnCmd = `alter table ${appSchema}.${table}
          add column ${defaultDisplayName} text;`;

      log.notice(
        chalk`Adding display name column: {magenta ${defaultDisplayName}}`
      );

      try {
        await sequelize.query(displayNameColumnCmd);
      } catch (err) {
        log.warning(err);
      }
    }

    return false;
  }

  log.notice('Table name is available.');

  log.info(
    chalk`Creating Table: {magenta ${name}} using display column {magenta ${defaultDisplayName}}`
  );

  const modelTemplateFile = path.resolve(
    __dirname,
    '../core/models/schema',
    '_model_template.sql'
  );

  let sql = fs.readFileSync(modelTemplateFile, {
    encoding: 'utf8',
    flag: 'r',
  });

  sql = sql.replace(/TOKEN_SCHEMA/g, appSchema);
  sql = sql.replace(/TOKEN_TABLE_NAME/g, name);
  sql = sql.replace(/TOKEN_DISPLAY_COLUMN_NAME/g, defaultDisplayName);
  sql = sql.replace(/TOKEN_DB_USER/g, process.env.PG_USERNAME);

  try {
    await sequelize.query(sql);

    log.success('Table created.');
  } catch (err) {
    log.error(err);
  }

  return true;
}

function createModel(name) {
  const filename = `${name}Model.js`;
  const newFile = path.resolve(__dirname, '../app/models', filename);
  const templateFile = path.resolve(
    __dirname,
    '../core/models',
    '_ModelTemplate.js'
  );

  log.info(chalk`Creating Model:\n  {magenta ${newFile}}`);

  let js = fs.readFileSync(templateFile, {
    encoding: 'utf8',
    flag: 'r',
  });

  let [schema, table] = dbTableName.split('.');

  if (!table) {
    table = schema;
  } else {
    appSchema = schema;
  }

  js = js.replace(/token_app_schema/g, appSchema);
  js = js.replace(/TokenModelName/g, name);
  js = js.replace(/token_display_name_column/g, defaultDisplayName);
  js = js.replace(/token_table_name/g, table);

  try {
    fs.writeFileSync(newFile, js);
    log.success(`Model created.`);
  } catch (err) {
    log.error(err);
  }

  return true;
}

function createRoute(name) {
  const filename = `${name}Routes.js`;
  const newFile = path.resolve(__dirname, '../app/routes', filename);
  const templateFile = path.resolve(
    __dirname,
    '../core/routes',
    '_RouteTemplate.js'
  );

  log.info(chalk`Creating Route:\n  {magenta ${newFile}}`);

  let js = fs.readFileSync(templateFile, {
    encoding: 'utf8',
    flag: 'r',
  });

  let [schema, table] = dbTableName.split('.');

  if (!table) {
    table = schema;
  } else {
    appSchema = schema;
  }

  js = js.replace(/token_table_name/g, table);

  try {
    fs.writeFileSync(newFile, js);
    log.success(`Route created.`);
  } catch (err) {
    log.error(err);
  }

  return true;
}

function createConfig(name) {
  const filename = `${name}Config.js`;
  const newFile = path.resolve(
    __dirname,
    '../../frontend/src/pages/models',
    filename
  );
  const templateFile = path.resolve(
    __dirname,
    '../../frontend/src/pages/models',
    '_ConfigTemplate.js'
  );

  log.info(chalk`Creating Config:\n  {magenta ${newFile}}`);

  let js = fs.readFileSync(templateFile, {
    encoding: 'utf8',
    flag: 'r',
  });

  js = js.replace(/token_display_name_column/g, defaultDisplayName);

  try {
    fs.writeFileSync(newFile, js);
    log.success(`Config created.`);
  } catch (err) {
    log.error(err);
  }

  return true;
}

function done(name) {
  const slug = inflector.dasherize(inflector.underscore(name));

  log.success(chalk`Model {yellow ${name}} was added successfully!`);
  console.log('');
  console.log(chalk`    ┌─────────────────────────────────── ─── ── ─ `);
  console.log(
    chalk`    │ {cyan REST API} : http://localhost:3005/api/${slug} `
  );
  console.log(
    chalk`    │  {cyan CRUD UI} : http://localhost:3000/models/${slug}`
  );
  console.log(chalk`    └───────────────────────────────────────── ─── ── ─ `);
  console.log('');

  const constantsFile = path.resolve(
    __dirname,
    '../../frontend/src/constants/index.js'
  );

  log.notice(
    chalk`To add to sidebar, edit CRUD_MODELS in:\n  {magenta ${constantsFile}}`
  );
}

function isPlural(word) {
  const plural = inflector.pluralize(word);

  return word === plural;
}

function modelExists(name) {
  const modelPath = path.resolve(
    __dirname,
    '../app/models/',
    `${name}Model.js`
  );

  try {
    return fs.existsSync(modelPath);
  } catch (err) {
    return false;
  }
}

function routeExists(name) {
  const routePath = path.resolve(
    __dirname,
    '../app/routes/',
    `${name}Routes.js`
  );

  try {
    return fs.existsSync(routePath);
  } catch (err) {
    return false;
  }
}

function configExists(name) {
  const configPath = path.resolve(
    __dirname,
    '../../frontend/src/pages/models/',
    `${name}Config.js`
  );

  try {
    return fs.existsSync(configPath);
  } catch (err) {
    return false;
  }
}

// start:output  ------------------------------------------------------------

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

output(header);

main();
