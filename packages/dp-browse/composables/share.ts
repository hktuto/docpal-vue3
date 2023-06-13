import { defineStore } from 'pinia'
import { DocumentThumbnailListGetApi } from 'dp-api'

export const useShareStore = defineStore('ShareStore', () => {
    const state = reactive({
        shareList: <any>[]
    })
    async function getMineTypeShareList(list:any) {
        const data = await DocumentThumbnailListGetApi(state.shareList.map((item:any) => item.id))
        return data
    }
    function updateShareList(list:any) {
        state.shareList = [...list]
        console.log('updateShareList?????????????????????????');
        sessionStorage.setItem('shareList', JSON.stringify(state.shareList))
    }

    function getUseWatermark(mimeType :string) {
        // check mintype is image, pdf or video
        if (mimeType.includes('image') || mimeType.includes('pdf') || mimeType.includes('video')) {
            return true
        }
        return false
    }
    onMounted(() => {
        const data = sessionStorage.getItem('shareList')
        if(!!data) state.shareList = JSON.parse(data)
    })
    return {
        getUseWatermark,
        getMineTypeShareList,
        updateShareList,
        state
    }
})
