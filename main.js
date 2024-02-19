const { app, BrowserWindow , screen } = require('electron/main')
const path = require('node:path')

const screenSize={
    height:null,
    width:null,
    newHeight:0,
    newWidth:0,
    x:null
}

async function getScreenSize(){
     const size = await screen.getPrimaryDisplay().size;
    console.log("async size==",size);
    screenSize.height = size.height;
    screenSize.width = size.width;
    screenSize.newHeight = Math.floor(size.height * 0.3);
    screenSize.newWidth = Math.floor(size.width * 0.2);
    screenSize.x = screenSize.width - screenSize.newWidth;
    console.log(screenSize);
}

async function createWindow () {

    console.log("inside createwindow",screenSize.x)

  const win = new BrowserWindow({
    width: screenSize.newWidth,
    height: screenSize.height,
    x:screenSize.x,
    y:0,
    webPreferences:{
        nodeIntegration:true,
        contextIsolation:true
    }
  })

  win.loadFile('index.html');

//   win.webContents.on('did-finish-load', () => {
//     const [windowWidth, windowHeight] = win.getContentSize();
//     console.log(`Window size: ${windowWidth} x ${windowHeight}`);
//   });
}

app.whenReady().then( async () => {
    //  const size = await screen.getPrimaryDisplay().workAreaSize;
    //  console.log("windo size----",size);
    // const newWidth =  await size.width* 0.9;
    // const newHeight =  await size.height *0.5;

    // console.log("windo size----",size , newHeight , newWidth);
 // createWindow(newHeight, newWidth , 0 , 0);
//  createWindow();
await getScreenSize();
createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
       // createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})