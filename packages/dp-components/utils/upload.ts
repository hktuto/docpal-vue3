// 添加 DataTransfer
export async function addDataTransfer(dataTransfer: any) {
    // dataTransfer.items 支持
    if (dataTransfer?.items?.length) {
        const entrys: Array<File | FileSystemEntry> = []
        // 遍历出所有 dataTransferVueUploadItem
        for (let i = 0; i < dataTransfer.items.length; i++) {
            const dataTransferTtem = dataTransfer.items[i]
            let entry: File | FileSystemEntry | null
            // @ts-ignore
            if (dataTransferTtem.getAsEntry) {
                // @ts-ignore
                entry = dataTransferTtem.getAsEntry() || dataTransferTtem.getAsFile()
            } else if (dataTransferTtem.webkitGetAsEntry) {
                entry = dataTransferTtem.webkitGetAsEntry() || dataTransferTtem.getAsFile()
            } else {
                entry = dataTransferTtem.getAsFile()
            }
            if (entry) {
                entrys.push(entry)
            }
        }
        
        return await getFileSystemEntry(entrys)
    }
    // dataTransfer.files 支持
    const files = []
    if (dataTransfer.files.length) {
        for (let i = 0; i < dataTransfer.files.length; i++) {
            files.push(dataTransfer.files[i])
        }
        return Promise.resolve(files)
    }
    return Promise.resolve([])
}
function getFileSystemEntry (entry: Array<File | FileSystemEntry> | File | FileSystemEntry, path = '') {
    return new Promise((resolve) => {
        if (!entry) {
            resolve([])
            return
        }
        if (entry instanceof Array) {
            // 多个
            const uploadFiles: any[] = []
            const forEach = (i: number) => {
                const v = entry[i]
                if (!v) {
                    return resolve(uploadFiles)
                }
                getFileSystemEntry(v, path).then(function (results: any) {
                    uploadFiles.push(...results)
                    forEach(i + 1)
                })
            }
            forEach(0)
            return
        }
        if (entry instanceof Blob) {
            resolve([
                {
                    id: '',
                    size: entry.size,
                    // @ts-ignore
                    name: entry.name,
                    path: path,
                    fileType: entry.type,
                    file: entry,
                }
            ])
            return
        }
        if (entry.isFile) {
            let fileEntry = entry as FileSystemFileEntry
            fileEntry.file(function (file: File) {
                resolve([
                    {
                    id: '',
                    size: file.size,
                    name: file.name,
                    path: path,
                    fileType: file.type,
                    file,
                    }
                ])
            })
            return
        }
        if (entry.isDirectory) {
            let directoryEntry = entry as FileSystemDirectoryEntry
            const uploadFiles: any[] = []
            const dirReader = directoryEntry.createReader()
            const readEntries = () => {
                dirReader.readEntries((entries: any) => {
                    const forEach = (i: number) => {
                    if ((!entries[i] && i === 0)) {
                        return resolve(uploadFiles)
                    }
                    if (!entries[i]) {
                        return readEntries()
                    }
                    getFileSystemEntry(entries[i], path + directoryEntry.name + '/').then(function (results: any) {
                        uploadFiles.push(...results)
                        forEach(i + 1)
                    })
                    }
                    forEach(0)
                })
            }
            readEntries()
            return
        }
        resolve([])
    })
  }
