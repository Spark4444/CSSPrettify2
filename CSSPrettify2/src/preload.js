const { contextBridge, ipcRenderer } = require("electron");

// Since we can't directly import ES modules in preload scripts,
// we'll expose IPC methods to communicate with the main process
contextBridge.exposeInMainWorld("electron", {
    prettify: (css, options) => ipcRenderer.invoke("prettify", css, options),
    // main shows the file dialog, so only send options to the main handler
    prettifyFile: (options) => ipcRenderer.invoke("prettifyFile", options),
});