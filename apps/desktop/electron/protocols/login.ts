import type { BrowserWindow } from "electron"
import type {EventHandlers} from './index'
import path from "path";


export const protocolLoginHandler:EventHandlers["handler"] = (mainWindow: BrowserWindow, event:any, url:string) => {
    let hash = url.split('#')[1]
    console.log("hash", hash)
    if(url.includes('login')) {
        return mainWindow.loadURL("http://localhost:3000/#" + hash)
        
    }
}