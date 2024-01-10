import { session } from "electron";

export const setUpSessionProxy = function (){
    const filter = { urls: ['*://*.wclsolution.com/*'] };
  
    session.defaultSession.webRequest.onBeforeSendHeaders(
        filter,
        (details, callback) => {
          details.requestHeaders['Origin'] = 'https://app4.wclsolution.com';
          details.requestHeaders['Referer'] = 'https://app4.wclsolution.com';
          callback({ requestHeaders: details.requestHeaders });
        }
    );
  
    session.defaultSession.webRequest.onHeadersReceived(
        filter,
        (details, callback) => {
          details.responseHeaders['Access-Control-Allow-Origin'] = [
              '*'
          ];
          callback({ responseHeaders: details.responseHeaders });
        }
    );
  }