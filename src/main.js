const { app, BrowserWindow, Menu, ipcMain } = require('electron');


let mainWindow;

let tasks = [];

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

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

/*
//catch the return item from the add window
ipcMain.on('task:add', function(e, task){
  tasks.push(task);
  console.log(tasks);
  mainWindow.webContents.send('task:add', task);
  addWindow.close();
});
*/

function showInputPanel(){
  mainWindow.webContents.send('showPanel', panel);
}

function showTasks(){

}




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// this template serves as the main bar up top. It essentially is an array
// of submenus with labels, with functions that are invoked on click
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Tracked Item'
      },
      {
        label: 'Clear All'
      },
      {
        label: 'Quit',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label:'Developer options',
    submenu: [
      {
        label: 'Toggle dev mode',
        click(item, focusedWindow){
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

// If mac then add an empty object to the menutemplate so that it renders properly
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({ });
}