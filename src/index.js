const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require("electron-reload")(__dirname)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
const W = 350;
const H = 110;
var TopUpdateTimeout;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: W,
    height: H,
    maxHeight: H, minHeight: H,
    maxWidth: W, minWidth: W,
    frame: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    alwaysOnTop: true,
    transparent: true,
  
  });

  ipcMain.on("close-app", () => app.quit());
  
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.setAlwaysOnTop(true, "floating");
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setFullScreenable(false);

  TopUpdateTimeout = setTimeout(function(){
    try {
      mainWindow.setAlwaysOnTop(true);
    } catch (TypeError) {
      clearTimeout(TopUpdateTimeout);
      mainWindow = null;
    }
  }, 1);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    clearTimeout(TopUpdateTimeout);
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.setLoginItemSettings({
  openAtLogin: true,
})