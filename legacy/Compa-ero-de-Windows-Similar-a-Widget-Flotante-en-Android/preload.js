const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('acompanante', {
  load: () => ipcRenderer.invoke('vault:load'),
  openMain: () => ipcRenderer.invoke('window:open-main'),
  toggleWidget: () => ipcRenderer.invoke('window:toggle-widget'),
  createTopic: (name) => ipcRenderer.invoke('topic:create', name),
  createNote: (payload) => ipcRenderer.invoke('note:create', payload),
  createHypothesis: (payload) => ipcRenderer.invoke('hypothesis:create', payload),
  runExperiment: (payload) => ipcRenderer.invoke('experiment:run', payload),
  createProposal: (payload) => ipcRenderer.invoke('proposal:create', payload)
});
