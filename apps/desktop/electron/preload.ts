

import {contextBridge, ipcRenderer } from 'electron'
console.log('---- electron/preload.ts ----');

contextBridge.exposeInMainWorld('shell', {
    open: () => ipcRenderer.send('shell:open')
  })