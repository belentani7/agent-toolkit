const { app, BrowserWindow, Tray, Menu, ipcMain, safeStorage, nativeImage } = require('electron');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { simulateMonteCarlo, simulateScenarios } = require('./simulations');
const { VAULT_VERSION, encryptPayload, decryptPayload } = require('./vault-crypto');
const { evaluateConceptualProtocol } = require('./protocol');

let mainWindow;
let widgetWindow;
let tray;
let vault;

function now() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function defaultVault() {
  const topicId = id('topic');
  return {
    version: VAULT_VERSION,
    createdAt: now(),
    topics: [{
      id: topicId,
      name: 'Modelo de ejemplo',
      color: '#8f7cf5',
      createdAt: now(),
      archived: false
    }],
    notes: [{
      id: id('note'),
      topicId,
      text: 'Idea inicial: modelar el efecto de variar capacidad y demanda con valores únicamente sintéticos.',
      tags: ['ejemplo', 'sintético'],
      createdAt: now()
    }],
    hypotheses: [{
      id: id('hyp'),
      topicId,
      text: 'Una mejora de capacidad superior a la variación de demanda reduce el tiempo de espera teórico.',
      target: 'tiempo de espera',
      createdAt: now()
    }],
    experiments: [],
    proposals: []
  };
}

function dataPaths() {
  const base = app.getPath('userData');
  return {
    key: path.join(base, 'vault-key.protected'),
    vault: path.join(base, 'vault.enc')
  };
}

async function resolveVaultKey() {
  const paths = dataPaths();
  try {
    const protectedKey = await fs.readFile(paths.key, 'utf8');
    const result = await safeStorage.decryptStringAsync(Buffer.from(protectedKey, 'base64'));
    return Buffer.from(result.result, 'base64');
  } catch (error) {
    if (error && error.code !== 'ENOENT') throw error;
    const key = crypto.randomBytes(32);
    const protectedKey = await safeStorage.encryptStringAsync(key.toString('base64'));
    await fs.mkdir(path.dirname(paths.key), { recursive: true });
    await fs.writeFile(paths.key, protectedKey.toString('base64'), { mode: 0o600 });
    return key;
  }
}

async function loadVault() {
  if (!(await safeStorage.isAsyncEncryptionAvailable())) {
    throw new Error('El cifrado del sistema no está disponible. La aplicación no abrirá datos sin protección.');
  }
  const key = await resolveVaultKey();
  try {
    const encrypted = await fs.readFile(dataPaths().vault, 'utf8');
    return decryptPayload(key, encrypted);
  } catch (error) {
    if (error && error.code !== 'ENOENT') throw error;
    const firstVault = defaultVault();
    await saveVault(firstVault, key);
    return firstVault;
  }
}

async function saveVault(nextVault, suppliedKey) {
  const key = suppliedKey || await resolveVaultKey();
  const payload = encryptPayload(key, nextVault);
  const temp = `${dataPaths().vault}.tmp`;
  await fs.writeFile(temp, payload, { mode: 0o600 });
  await fs.rename(temp, dataPaths().vault);
}

function snapshot() {
  return structuredClone(vault);
}

async function persist() {
  await saveVault(vault);
  return snapshot();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 940,
    minHeight: 640,
    show: false,
    backgroundColor: '#F8F7FB',
    title: 'Acompañante',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
}

function createWidgetWindow() {
  widgetWindow = new BrowserWindow({
    width: 364,
    height: 186,
    minWidth: 300,
    minHeight: 146,
    maxWidth: 420,
    maxHeight: 240,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });
  widgetWindow.setAlwaysOnTop(true, 'floating');
  widgetWindow.loadFile(path.join(__dirname, 'index.html'), { query: { widget: '1' } });
  widgetWindow.once('ready-to-show', () => widgetWindow.showInactive());
  widgetWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  widgetWindow.webContents.on('will-navigate', (event) => event.preventDefault());
}

function showMain() {
  if (!mainWindow) createMainWindow();
  mainWindow.show();
  mainWindow.focus();
}

function toggleWidget() {
  if (!widgetWindow) createWidgetWindow();
  if (widgetWindow.isVisible()) widgetWindow.hide();
  else widgetWindow.showInactive();
}

function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip('Acompañante local');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Abrir investigación', click: showMain },
    { label: 'Mostrar u ocultar widget', click: toggleWidget },
    { type: 'separator' },
    { label: 'Salir', click: () => app.quit() }
  ]));
  tray.on('click', showMain);
}

ipcMain.handle('vault:load', () => snapshot());
ipcMain.handle('window:open-main', () => showMain());
ipcMain.handle('window:toggle-widget', () => toggleWidget());
ipcMain.handle('topic:create', async (_event, name) => {
  const text = String(name || '').trim().slice(0, 80);
  if (!text) throw new Error('El tema requiere un nombre.');
  vault.topics.unshift({ id: id('topic'), name: text, color: '#8f7cf5', createdAt: now(), archived: false });
  return persist();
});
ipcMain.handle('note:create', async (_event, payload) => {
  const topicId = String(payload.topicId || '');
  const text = String(payload.text || '').trim().slice(0, 10000);
  if (!vault.topics.some((topic) => topic.id === topicId)) throw new Error('Tema no encontrado.');
  if (!text) throw new Error('La nota no puede estar vacía.');
  vault.notes.unshift({ id: id('note'), topicId, text, tags: [], createdAt: now() });
  return persist();
});
ipcMain.handle('hypothesis:create', async (_event, payload) => {
  const topicId = String(payload.topicId || '');
  const text = String(payload.text || '').trim().slice(0, 1000);
  const target = String(payload.target || 'resultado').trim().slice(0, 80);
  if (!vault.topics.some((topic) => topic.id === topicId)) throw new Error('Tema no encontrado.');
  if (!text) throw new Error('La hipótesis no puede estar vacía.');
  vault.hypotheses.unshift({ id: id('hyp'), topicId, text, target, createdAt: now() });
  return persist();
});
ipcMain.handle('experiment:run', async (_event, payload) => {
  const topicId = String(payload.topicId || '');
  if (!vault.topics.some((topic) => topic.id === topicId)) throw new Error('Tema no encontrado.');
  const method = String(payload.method || '');
  let result;
  if (method === 'monte-carlo') result = simulateMonteCarlo(payload.params || {});
  else if (method === 'escenarios') result = simulateScenarios(payload.params || {});
  else throw new Error('Método de simulación no permitido.');
  const experiment = { id: id('exp'), topicId, createdAt: now(), ...result };
  experiment.protocol = evaluateConceptualProtocol(experiment);
  vault.experiments.unshift(experiment);
  await persist();
  return experiment;
});
ipcMain.handle('proposal:create', async (_event, payload) => {
  const topicId = String(payload.topicId || '');
  const text = String(payload.text || '').trim().slice(0, 5000);
  if (!vault.topics.some((topic) => topic.id === topicId)) throw new Error('Tema no encontrado.');
  if (!text) throw new Error('La propuesta no puede estar vacía.');
  vault.proposals.unshift({ id: id('proposal'), topicId, text, createdAt: now(), status: 'borrador' });
  return persist();
});

app.whenReady().then(async () => {
  try {
    vault = await loadVault();
    createMainWindow();
    createWidgetWindow();
    createTray();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
      else showMain();
    });
  } catch (error) {
    const { dialog } = require('electron');
    dialog.showErrorBox('No se pudo abrir la bóveda local', error.message);
    app.quit();
  }
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
});

app.on('before-quit', () => {
  mainWindow = undefined;
  widgetWindow = undefined;
});
