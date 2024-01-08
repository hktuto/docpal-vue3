import type { BrowserWindow } from "electron"
import type {EventHandlers} from './index'


export const protocolLoginHandler:EventHandlers["handler"] = (mainWindow: BrowserWindow, event:any, url:string) => {
    const hash = url.split('#')[1]
    console.log('hash', hash, process.env.VITE_DEV_SERVER_URL)
    if(url.includes('/login')) {
        if (process.env.VITE_DEV_SERVER_URL) {
            mainWindow.loadURL("http://localhost:3000#" + hash)
            mainWindow.webContents.openDevTools()
            return true
        } else {
            mainWindow.loadFile(process.env.VITE_PUBLIC + '/index.html#' + hash)
            mainWindow.webContents.openDevTools()
            return true
        }
    }
}