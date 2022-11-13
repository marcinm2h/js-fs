import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';

const resolve = (p) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, p);
};

const PATHS = {
  INDEX: resolve('dist/client/index.html'),
  CLIENT: resolve('dist/client'),
  ENTRY: resolve('dist/server/entry-server.mjs'),
};

export async function createServer() {
  const app = express();

  app.use(compression());
  app.use(
    serveStatic(PATHS.CLIENT, {
      index: false,
    }),
  );

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      const template = fs.readFileSync(resolve(PATHS.INDEX), 'utf-8');
      const render = (await import(PATHS.ENTRY)).render;

      const context = {};
      const appHtml = render(url, context);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      const html = template.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app };
}

createServer().then(({ app }) => {
  const PORT = process.env.PORT || 5173;

  app.listen(PORT, () => {
    console.log(`​🚀 http://localhost:${PORT}`);
  });
});
