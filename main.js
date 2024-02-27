console.log("mian.js logged...");

const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  clipboard,
} = require("electron/main");
const ElectronStore = require("electron-store");
ElectronStore.initRenderer();

const screenSize = {
  height: null,
  width: null,
  newHeight: 0,
  newWidth: 0,
  x: null,
};

async function getScreenSize() {
  const size = screen.getPrimaryDisplay().size;
  screenSize.height = size.height;
  screenSize.width = size.width;
  screenSize.newHeight = Math.floor(size.height * 1);
  screenSize.newWidth = Math.floor(size.width * 0.2);
  screenSize.x = screenSize.width - screenSize.newWidth;
}

async function createWindow() {
  const win = new BrowserWindow({
    width: screenSize.newWidth,
    height: screenSize.height,
    x: screenSize.x,
    y: 0,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadFile("index.html");
  win.once("ready-to-show", () => {
    win.show();
  });

  //another meothd
  //   win.loadURL(url.format({
  //     pathname:path.join(__dirname,'index.html'),
  //     protocol:'file',
  //     slashes:true
  //   }));

  //devtools
  //win.webContents.openDevTools();

  // Handle the 'toggle-always-on-top' message from the renderer process
  ipcMain.on("toggle-always-on-top", (event, alwaysOnTop) => {
    win.setAlwaysOnTop(alwaysOnTop);
  });
}

app.whenReady().then(async () => {
  await getScreenSize();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("copy-to-clipboard", (event, data) => {
  clipboard.writeText(data);
});

ipcMain.on("paste-from-clipboard", (event) => {
  const data = clipboard.readText();
  event.reply("clipboard-data", data);
});
