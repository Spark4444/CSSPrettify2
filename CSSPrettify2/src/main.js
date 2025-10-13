import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import squirrelStartup from "electron-squirrel-startup";
import CSSPrettify from "./functions/CSSPrettify.js";

console.log(CSSPrettify.prettify("body{color:red;} /* This is a comment */"));

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
const template = [

];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// IPC handlers for CSS prettification
ipcMain.handle("prettifyCss", async (event, css, options) => {
  try {
    return CSSPrettify.prettify(css, options);
  } catch (error) {
    throw new Error(`Failed to prettify CSS: ${error.message}`);
  }
});

ipcMain.handle("prettifyFile", async (event, filePath, options) => {
  try {
    return CSSPrettify.prettifyFile(filePath, options);
  } catch (error) {
    throw new Error(`Failed to prettify file: ${error.message}`);
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