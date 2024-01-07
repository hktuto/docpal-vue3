import { app, BrowserWindow, session } from 'electron'
import path from 'path'

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, 'public')
  : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow
const preload = path.join(process.env.DIST, 'preload.js')

function bootstrap() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL("http://localhost:3000")
    win.webContents.openDevTools()
  } else {
    win.loadFile(process.env.VITE_PUBLIC + '/index.html')
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {

  const filter = { urls: ['*://*.wclsolution.com/*'] };

  session.defaultSession.webRequest.onBeforeSendHeaders(
      filter,
      (details, callback) => {
        console.log(details);
        details.requestHeaders['Origin'] = 'https://app4.wclsolution.com';
        callback({ requestHeaders: details.requestHeaders });
      }
  );

  session.defaultSession.webRequest.onHeadersReceived(
      filter,
      (details, callback) => {
        console.log(details);
        details.responseHeaders['Access-Control-Allow-Origin'] = [
          'capacitor-electron://-',
            '*'
        ];
        callback({ responseHeaders: details.responseHeaders });
      }
  );
  
    bootstrap();
})