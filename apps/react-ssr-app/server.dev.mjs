import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer } from 'vite';

const resolve = (p) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, p);
};

const PATHS = {
  INDEX: resolve('index.html'),
  ENTRY: resolve('src/entry-server.jsx'),
};

const app = express();

createServer({
  root: process.cwd(),
  logLevel: 'info',
  server: {
    middlewareMode: true,
    watch: {
      // During tests we edit the files too fast and sometimes chokidar
      // misses change events, so enforce polling for consistency
      usePolling: true,
      interval: 100,
    },
    hmr: {
      // port: hmrPort,
    },
  },
  appType: 'custom',
}).then((vite) => {
  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      // apply vite's <script>-s
      const template = await vite.transformIndexHtml(
        url,
        fs.readFileSync(PATHS.INDEX, 'utf-8'),
      );

      const render = (await vite.ssrLoadModule(PATHS.ENTRY)).render;

      const context = {};
      const appHtml = render(url, context);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      const html = template.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  const PORT = process.env.PORT || 5173;

  app.listen(PORT, () => {
    console.log(`​🚀 http://localhost:${PORT}`);
  });
});
