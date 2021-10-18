<div align="center">

  ![LRE Water](https://user-images.githubusercontent.com/366737/131208262-d428e49f-3757-474f-ba3c-a12ca98b3215.png)

  <h1 align="center">Unified Platform</h1>
  <p align="center">

  [![Dependency Status](https://img.shields.io/david/dev/lre-water/up?label=deps)](https://david-dm.org/lre-water/up)
  [![Dependency Status](https://img.shields.io/david/dev/lre-water/up?label=devDeps)](https://david-dm.org/lre-water/up?type=dev)

  </p>
</div>

## Introduction

This project is the home LRE Water's Unified Platform, a water-centric starter-kit for modern web applications. Here are some of the highlights:

- Mobile First UI
- Auth0 Integration
- Public, Private, and Role/Permission-based Routing
- Theming
- "Dashboard" Layout
- CRUD Example(s)
- Chart Example(s)
- Common UI Component Example(s)

## Installation

It is recommended that you fork the project on GitHub so that you can have a repository to commit your project-specific changes while still being able to pull in any future unified platform updates or push any code from your project that would also be a good contribution to the platform.

Before forking, ensure you are logged into GitHub with the LRE Water GitHub account and not your personal account.

To fork, visit https://github.com/lre-water/up and click the **Fork** button in the upper-right corner. Please prefix your for names with `up-` so we can easily identify the projects built on the Unified Platform.

After forking, use the following commands to clone your fork and install the starter kit.

```sh
git clone https://github.com/lre-water/up-yourforkname <app-name> && cd app-name
```

```sh
yarn
```

At this point, you should be able to start the development server and begin work on your project.

To start the development server:

```shell
yarn start:frontend && yarn start:backend
```

## Usage

```sh
$ yarn start           > Starts the development server
                         NOTE: We recommend starting frontend and backend
                         separately for stability and ease of debugging

$ yarn start:frontend  > Starts the development frontend server

$ yarn start:backend   > Starts the development backend server

$ yarn cli             > Starts the development command-line tools

$ yarn lint            > Lints the code

$ yarn format          > Formats the code

$ yarn build           > Builds and bundles the project

$ yarn commit          > Commits the code using a wizard
```

## Links

- [Slack](https://lrewits.slack.com/archives/C02C386BBAT)
- [Documentation](https://lre-water.github.io/up)
- [Private Issue Tracker](https://dougkulak.atlassian.net/browse/LRE)
- [Public Issue Tracker](https://github.com/lre-water/up/issues)

## License
Distributed under the [MIT](./LICENSE) license.
