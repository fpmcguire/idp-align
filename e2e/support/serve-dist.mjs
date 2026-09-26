// Zero-dependency static server for E2E: serves the production build on 127.0.0.1 only, with
// index.html fallback for application routes. Started and stopped by Playwright's webServer.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../../dist/idp-align/browser', import.meta.url)));
const host = '127.0.0.1';
const port = Number(process.env.E2E_PORT ?? 4300);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? '/', `http://${host}`).pathname);
  const candidate = normalize(join(root, pathname));

  // Never serve outside the build output.
  if (candidate !== root && !candidate.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }

  // Missing files with an extension are real 404s; extensionless paths are application routes.
  let file = candidate;
  if (!(await isFile(file))) {
    if (extname(pathname)) {
      res.writeHead(404).end();
      return;
    }
    file = join(root, 'index.html');
  }

  const body = await readFile(file);
  res.writeHead(200, {
    'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  res.end(body);
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`);
});
