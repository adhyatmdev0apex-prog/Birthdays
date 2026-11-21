const express = require('express');
const http = require('node:http');
const { spawn } = require('node:child_process');
const path = require('node:path');

const app = express();
const root = __dirname;
const dashboardRoot = path.join(root, "Ritika_mam's_stuff", 'dashboard');
const dashboardPort = Number(process.env.DASHBOARD_INTERNAL_PORT || 4173);

let dashboardProcess;
if (process.env.RENDER === 'true') {
  dashboardProcess = spawn(process.execPath, [path.join(dashboardRoot, 'server.js')], {
    cwd: dashboardRoot,
    env: { ...process.env, RENDER: '', PORT: String(dashboardPort) },
    stdio: ['ignore', 'inherit', 'inherit']
  });
  dashboardProcess.on('error', (error) => {
    console.error(`[dashboard] Could not start dashboard server: ${error.message}`);
  });
  dashboardProcess.on('exit', (code, signal) => {
    if (code !== 0 && code !== null) {
      console.error(`[dashboard] Dashboard server exited with code ${code}.`);
    } else if (signal) {
      console.error(`[dashboard] Dashboard server stopped after ${signal}.`);
    }
  });
}

function proxyDashboard(request, response) {
  const upstream = http.request({
    hostname: '127.0.0.1',
    port: dashboardPort,
    path: request.originalUrl,
    method: request.method,
    headers: { ...request.headers, host: `127.0.0.1:${dashboardPort}` }
  }, (upstreamResponse) => {
    response.status(upstreamResponse.statusCode || 502);
    for (const [name, value] of Object.entries(upstreamResponse.headers)) {
      if (value !== undefined) response.setHeader(name, value);
    }
    upstreamResponse.pipe(response);
  });

  upstream.on('error', (error) => {
    console.error(`[dashboard] Proxy failed for ${request.method} ${request.originalUrl}: ${error.message}`);
    if (!response.headersSent) {
      response.status(502).json({ error: 'The dashboard service is unavailable. Check the Render logs.' });
    } else {
      response.destroy(error);
    }
  });
  request.pipe(upstream);
}

const sites = [
  ['/chutu', path.join(root, 'Chutu_X_mutt_chachus-bday', 'dist')],
  ['/mama', path.join(root, "Mama-b;day", 'dist')],
  ['/bro', path.join(root, 'my-bros-birthday-main')],
  ['/ritika', path.join(root, "Ritika_mam's_stuff")],
  ['/sri', path.join(root, 'Sri_bday')],
  ['/papa', path.join(root, "papa's_b'day", 'data')]
];

app.get('/', (request, response) => {
  response.sendFile(path.join(root, 'index.html'));
});

app.use('/api', proxyDashboard);
app.use('/uploads', proxyDashboard);
app.use('/references', proxyDashboard);
app.get('/GITHUB_APP_SETUP.md', proxyDashboard);
app.use('/ritika/dashboard', express.static(dashboardRoot));

for (const [route, directory] of sites) {
  app.use(route, express.static(directory));
}

const webServer = app.listen(process.env.PORT || 10000, '0.0.0.0');

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    if (dashboardProcess && !dashboardProcess.killed) dashboardProcess.kill(signal);
    webServer.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
