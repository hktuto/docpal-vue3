import { defineStore } from 'pinia'

export const useUploadStore = defineStore('UploadStore', () => {
    const state = reactive({
        uploadFiles: <any>[]
    })
    function setUploadFiles (files: any) {
        state.uploadFiles = files
    }
    function getUploadFiles () {
        return state.uploadFiles
    }
    onMounted(() => {
    })
    return {
        getUploadFiles,
        setUploadFiles,
        state
    }
})
