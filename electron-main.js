import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

let mainWindow;

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true, // Run in full screen by default
    autoHideMenuBar: true, // Hide the menu bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
  });

  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
});

// Handle store-get IPC
ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

// Handle store-set IPC
ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
});

// Handle store-delete IPC
ipcMain.handle('store-delete', (event, key) => {
  store.delete(key);
});