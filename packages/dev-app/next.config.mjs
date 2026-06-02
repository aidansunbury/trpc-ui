// packages/dev-app/next.config.mjs
import withTM from "next-transpile-modules";

/**
 * Tell Next to transpile the workspace package `trpc-ui`.
 * The array can contain multiple workspace packages if you need them.
 */
const withTMConfig = withTM([
  // Relative to the dev‑app folder – this resolves to the workspace package
  "trpc-ui",
]);

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: {
    externalDir: true,
    esmExternals: true,
  },
};
export default withTMConfig(config);
