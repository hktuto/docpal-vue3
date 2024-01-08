import type { BrowserWindow } from "electron";
import {protocolLoginHandler} from './login'
export type EventHandlers = {
    path: string
    handler: (mainWindow: BrowserWindow, event:any, url:string ) => void
}

const handlers:EventHandlers[] = [
    {
        path:'/login',
        handler: protocolLoginHandler
    },
]

export const protocolHandler = (mainWindow: BrowserWindow, event:any, url:string ) => {
    const handler = handlers.find(handler => url.includes(handler.path)) as EventHandlers
    if(!handler) return
    return handler.handler(mainWindow, event, url)
    
}