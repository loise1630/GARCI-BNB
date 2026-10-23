import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = normalize(pathname === '/' ? 'index.html' : pathname.slice(1));
    if (relative.startsWith('..')) throw new Error('Invalid path');
    const filename = join(root, relative);
    if (!(await stat(filename)).isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'Content-Type': types[extname(filename).toLowerCase()] ?? 'application/octet-stream' });
    res.end(await readFile(filename));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '127.0.0.1', () => console.log(`Garci's Staycation running at http://localhost:${port}`));
