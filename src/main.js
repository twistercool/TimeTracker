const { app, BrowserWindow, Menu, ipcMain } = require('electron');

let mainWindow;
// global.mainWindow = mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // loads tasks on load
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('loadFiles');
  });

  // saves before quitting, waits for everything to be saved
  let saved = false;
  mainWindow.on('close', (e) => {
    if (!saved) {
      e.preventDefault(); //prevents the app from closing until it's saved
      mainWindow.webContents.send('saveFiles');
      ipcMain.on('saveComplete', () => {
        saved = true;
        app.quit();
      });
    }
  });

  // Quit app when main window closed
   mainWindow.on('closed', function(){
      app.quit();
   });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert the menu into the app
  Menu.setApplicationMenu(mainMenu);

  // and load the .html of the app.
  mainWindow.loadFile('src\\mainWindow.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)


// this template serves as the main bar up top. It essentially is an array
// of submenus with labels, with functions that are invoked on click
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Clear All',
        click() {
          mainWindow.webContents.send('itemsClear');
        }
      },
      {
        label: 'Quit',
        click() {
          app.quit();
        }
      },
      {
        label: 'Save',
        click() {
          //sends the event to the mainRender.js
          mainWindow.webContents.send('saveFiles');
        }
      },
      {
        label: 'Load From Save File',
        click() {
          //sends the event to the mainRender.js
          mainWindow.webContents.send('loadFiles');
        }
      }
    ]
  },
  {
    label: 'Developer options',
    submenu: [
      {
        label: 'Toggle dev mode',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  }
];

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// If mac then add an empty object to the menu template so that it renders properly
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({ });
}