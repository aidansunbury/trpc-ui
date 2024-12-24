# Contributing

`trpc-ui` is open to contributions! Before getting started, check the open issues, or create a new one for bug fixes or feature improvements. @aidansunbury to be assigned to the issue.

It is also extremely helpful to upvote (👍) or downvote (👎) existing bugs and features, to ensure that the most in demand features or problematic bugs get addressed first.

## Repo Overview

There are three main packages in this repo:
1. `trpc-ui`: The main package that is [published to npm](https://www.npmjs.com/package/trpc-ui)
2. `dev-app`: A development app that makes it easy to work on `trpc-ui` locally. It uses the `trpc-ui` package.
3. `test-app`: A [showcase application](https://trpc.aidansunbury.dev/) to demonstrate the capabilities of `trpc-ui`

The repo is configured to work with yarn v1 workspaces. To install dependencies for all three packages, run:

```sh
yarn
```

When adding new dependencies, be sure to add them in the correct package, and not the top level `package.json`.

### Development App

Included in this repo there is a development app that makes it easy to work on `trpc-ui` locally. It is a `next.js` app that will render the router included in the dev app. To run it, do:

```sh
yarn dev:dev-app # Run at base of monorepo
```

```sh
cd packages/dev-app && yarn dev # To run in the dev-app directory
```

This will run the app in your browser.

To add / remove procedures from the dev app's panel, modify its router in [router.ts](./packages/dev-app/src/router.ts). Please do not commit changes to this file.

### Test App

The test app is just a simple express server. The procedures can be modified in the test-app [router.ts](./packages/test-app/src/router.ts) router. After adding new functionality to the trpc-ui package, be sure to showcase it in the test app!

```sh
yarn dev:test-app # Run at base of monorepo
```

```sh
cd packages/test-app && yarn dev # To run in the test-app directory
```


## Front end contributions

The `trpc-ui` front end is just a bunch of react components. Any updates made to the react components should immediately be visible while running the `dev-app`.

The React components are located in `packages/trpc-ui/src/react-app`.

## Updating the parser

For more advanced features, it may be required to update the parsing logic, which can be found in `packages/trpc-ui/parse`.

### Running the parser tests

Jest is used to test the functionality of the parser. To run them, use

```sh
yarn test:panel
```

at the root of the monorepo. If you add additional functionality to the parser, please add tests for the new functionality.

## Linting and Formatting

trpc-ui uses [biome](https://biomejs.dev/) as a linter and formatter. To just check for errors, run

```bash
yarn biome:check
```

To fix them, run
```bash
yarn biome:check:fix
```

both at the root of the monorepo. Not all errors can be fixed automatically.

There are a good number of errors in much of the older code, but please try not to introduce new ones.