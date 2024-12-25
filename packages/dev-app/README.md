# Dev App

This app is for development of `trpc-panel`. See our [contributing](../../CONTRIBUTING.md) guide for more information.

## Toggling Superjson
There are several features of `trpc-ui` which only work with superjson enabled, meaning it is important be able to quickly test the package with and without superjson. Superjson is enabled by default in the dev app, but can be disabled by setting an environment variable `SUPERJSON=false`