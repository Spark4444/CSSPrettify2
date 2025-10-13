const { contextBridge, ipcRenderer } = require("electron");

// Since we can't directly import ES modules in preload scripts,
// we'll expose IPC methods to communicate with the main process
contextBridge.exposeInMainWorld("electron", {
    prettify: (css, options) => ipcRenderer.invoke("prettifyCss", css, options),
    prettifyFile: (filePath, options) => ipcRenderer.invoke("prettifyFile", filePath, options)
});