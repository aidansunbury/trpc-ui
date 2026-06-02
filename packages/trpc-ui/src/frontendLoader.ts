export async function loadFrontend(): Promise<{
  js: string;
  css: string;
  html: string;
} | null> {
  try {
    const { promises: fs } = await import("node:fs");
    const { dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");

    const dirLocation = __dirname ?? dirname(fileURLToPath(import.meta.url));
    const [html, js, css] = await Promise.all([
      fs.readFile(`${dirLocation}/react-app/index.html`, "utf-8"),
      fs.readFile(`${dirLocation}/react-app/bundle.js`, "utf-8"),
      fs.readFile(`${dirLocation}/react-app/index.css`, "utf-8"),
    ]);

    return { css, html, js };
  } catch {
    return null;
  }
}
