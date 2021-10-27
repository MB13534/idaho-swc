<div align="center">

  ![LRE Water](https://user-images.githubusercontent.com/366737/131208262-d428e49f-3757-474f-ba3c-a12ca98b3215.png)

  <h1 align="center">Unified Platform</h1>
  <p align="center">

  [![Dependency Status](https://img.shields.io/david/dev/lre-water/up?label=deps)](https://david-dm.org/lre-water/up)
  [![Dependency Status](https://img.shields.io/david/dev/lre-water/up?label=devDeps)](https://david-dm.org/lre-water/up?type=dev)

  </p>
</div>

## Introduction

LRE Water's Unified Platform (UP) is a modern CMS and Dashboard Starter
Kit built with React, Node.js, and Material UI. UP provides a standard
and robust starting point for any project requiring modern content
management tools with a responsive, mobile-first design.

## Installation

It is recommended that you fork the project on GitHub so that you can have a repository to commit your project-specific changes while still being able to pull in any future unified platform updates or push any code from your project that would also be a good contribution to the platform.

To fork, visit https://github.com/lre-water/up and click the **Fork** button in the upper-right corner.

After forking, use the following commands to clone your fork and install the starter kit. Be sure to replace *yourusername*, *yourforkname*, and *yourappname* with the appropriate values.

```sh
git clone https://github.com/yourusername/yourforkname yourappname
```

```sh
cd yourappname && yarn install
```

You can now start the development server and begin work on your project!

```sh
yarn start:frontend && yarn start:backend
```

To learn more, check out our [documentation](https://lre-up.com/documentation/introduction) and be sure to leave a message in Slack (#lre-unified-platform) if you have any questions.

## Usage

```text
$ yarn start           > Start the development server
                         NOTE: We recommend starting frontend and backend
                         separately for stability and ease of debugging

$ yarn start:frontend  > Start the development frontend server

$ yarn start:backend   > Start the development backend server

$ yarn cli             > Start the development command-line wizard

$ yarn lint            > Lint the code

$ yarn format          > Format the code

$ yarn build           > Build and bundle the project

$ yarn commit          > Commit the code using a wizard
```

## Links

- [Slack](https://lrewits.slack.com/archives/C02C386BBAT)
- [Documentation](https://lre-water.github.io/up)
- [Private Issue Tracker](https://dougkulak.atlassian.net/browse/LRE)
- [Public Issue Tracker](https://github.com/lre-water/up/issues)

## License
Distributed under the [MIT](./LICENSE) license.
