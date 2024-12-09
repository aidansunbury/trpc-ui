# Contributing

TRPC Panel welcomes and encourages open source contributions.

## Local Development

The repo is configured to work with yarn v1 workspaces. To install dependencies, run:

```sh
yarn
```

### Development App

Included in this repo there is a development app that makes it easy to work on `trpc-ui` locally. It is a `next.js` app that will render the router included in the dev app. To run it, do:

```sh
cd packages/dev-app && yarn dev
```

This will run the app in your browser.

To add / remove procedures from the dev app's panel, modify its router in `packages/dev-app/src/router.ts`. Please do not commit changes to this file.

## Front end contributions

The `trpc-ui` front end is just a bunch of react components. Any updates made to the react components should immediately be visible while running the `dev-app`.

The React components are located in `packages/trpc-ui/src/react-app`.

## Updating the parser

For more advanced features, it may be required to update the parsing logic, which can be found in `packages/trpc-ui/parse`.

## Running the tests

Jest is used to test the functionality of the parser. To run them, use

```sh
yarn test:panel
```

at the root of the monorepo.

## Linting and Formatting

trpc-ui uses biome as a linter and formatter. To just check for errors, run
```bash
yarn biome:check
```

To fix them, run
```bash
yarn biome:fix
```