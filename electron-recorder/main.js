const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { initMain } = require('electron-audio-loopback');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Initialize audio loopback BEFORE app is ready
initMain();

let mainWindow = null;
let apiServer = null;

// Local HTTP API for external apps
function startApiServer() {
  apiServer = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = req.url.split('?')[0];

    if (url === '/status' && req.method === 'GET') {
      mainWindow.webContents.send('api-get-status');
      ipcMain.once('api-status-response', (event, status) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status));
      });
      return;
    }

    if (url === '/start' && req.method === 'POST') {
      mainWindow.webContents.send('api-start');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Recording started' }));
      return;
    }

    if (url === '/stop' && req.method === 'POST') {
      mainWindow.webContents.send('api-stop');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Recording stopped' }));
      return;
    }

    if (url === '/save' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { path: savePath } = JSON.parse(body);
          if (!savePath) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: 'path required' }));
            return;
          }
          mainWindow.webContents.send('api-save', savePath);
          ipcMain.once('api-save-response', (event, result) => {
            res.writeHead(result.ok ? 200 : 500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          });
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Not found' }));
  });

  apiServer.listen(3333, '127.0.0.1', () => {
    console.log('API server running at http://localhost:3333/');
  });
}

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  startApiServer();
});

// Handle save dialog
ipcMain.handle('save-recording', async (event, buffer, defaultName) => {
  const result = await dialog.showSaveDialog({
    title: 'Save Recording',
    defaultPath: defaultName,
    filters: [{ name: 'Audio', extensions: ['webm'] }]
  });
  
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, Buffer.from(buffer));
    return result.filePath;
  }
  return null;
});

app.on('window-all-closed', () => {
  app.quit();
});
