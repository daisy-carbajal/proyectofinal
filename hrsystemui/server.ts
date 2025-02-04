import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// Importar Sentry
import * as Sentry from '@sentry/node';

// Inicializar Sentry
Sentry.init({
  dsn: 'https://52951e4f991008d9a8589a5ec6750bf7@o4508469580988416.ingest.us.sentry.io/4508473266339840',
  tracesSampleRate: 1.0,
  environment: 'production',
});

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Middleware para capturar solicitudes y errores
  server.use((req: Request, res: Response, next: NextFunction) => {
    try {
      next();
    } catch (err) {
      Sentry.captureException(err);
      next(err);
    }
  });

  // Servir archivos estáticos
  server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));

  // Todas las rutas normales
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => {
        Sentry.captureException(err); // Capturar el error con Sentry
        next(err); // Pasar el error al siguiente middleware
      });
  });

  // Middleware para manejar errores
  server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    Sentry.captureException(err);
    res.status(500).send('An unexpected error occurred.');
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Simular un error de prueba
throw new Error('Test error for Sentry SSR!');

run();
