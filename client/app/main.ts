import {app, BrowserWindow, screen, ipcMain} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { createConnection } from 'typeorm';
import {Item} from "./Item";
import { homedir } from "os";

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });


  let connection = undefined;
  let itemRepo = undefined;
  const dbFilePath = homedir() + '/.gable/database.sqlite';
  console.log('sqlite3 file in ' + dbFilePath);
  createConnection({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: dbFilePath,
    entities: [Item],
  }).then((r) => {
    connection = r;
    itemRepo = connection.getRepository(Item);

    const item_1 = itemRepo.create({id: new Date().getTime() + 2, name: new Date().toString()});
    itemRepo.save(item_1);

    const item_2 = itemRepo.create({id: new Date().getTime() + 5, name: new Date().toString()});
    itemRepo.save(item_2);
  });

  ipcMain.on('get-data', async (event: any, ...args: any[]) => {
    if (itemRepo) {
      try {
        event.returnValue = await itemRepo.find();
      } catch (err) {
        throw err;
      }
    }else {
      try {
        event.returnValue = {id: 0, name: 'item repo not init'};
      } catch (err) {
        throw err;
      }
    }
  });


  return win;
}

try {
  // electron-v18.0.1-win32-x64.zip

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}


