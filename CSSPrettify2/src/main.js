import { app, BrowserWindow, Menu, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import squirrelStartup from "electron-squirrel-startup";
import CSSPrettify from "./functions/CSSPrettify.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "img/app.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      fullscreenable: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "window/index.html"));

  // Comment when packaging
  mainWindow.webContents.openDevTools();
  mainWindow.maximize();
};

// Remove menu bar
// const template = [

// ];

// const menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(menu);

// IPC handlers for CSS prettification
ipcMain.handle("prettify", async (event, css, options) => {
  try {
    return CSSPrettify.prettify(css, options);
  } catch (error) {
    throw new Error(`Failed to prettify CSS: ${error.message}`);
  }
});

// IPC handler for opening file dialog
ipcMain.handle("prettifyFile", async (event, options) => {
  try {
    // Show open file dialog
    const result = await dialog.showOpenDialog({
      title: "Select CSS File",
      filters: [
        { name: "CSS Files", extensions: ["css"] },
        { name: "All Files", extensions: ["*"] }
      ],
      properties: ["openFile"]
    });
    
    // If a file was selected, prettify it
    if (!result.canceled && result.filePaths.length > 0) {
      const cssResult = CSSPrettify.prettifyFile(result.filePaths[0], options);
      const fileName = path.basename(cssResult);
      return fileName;
    }

    return null;
  } catch (error) {
    throw new Error(`Failed to open file dialog: ${error.message}`);
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});