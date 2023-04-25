// @ts-ignore
import * as mime from 'mime-types'

export function downloadUrl(url:string, name:string){
    const a = document.createElement('a')
    a.id = 'file_' + Date.now();
    a.href = url
    a.download = name;
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove();
  }

  export function calFileExt(mimeType: string, name: string) {
    const ext = mime.extension(mimeType);
    if(ext) return ext;
    const arr = name.split('.');
    return arr[arr.length -1];
  }
  
  export function calFileNameAndExt(mimeType: string, name: string):string {
    const ext = mime.extension(mimeType);
    // check name include extension
    if(ext){
      return name + '.' + ext;
    } else {
      return name;
    }
    
  }