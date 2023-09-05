import { defineStore } from 'pinia'
import { DocumentThumbnailListGetApi,SimplifiedDocDetail } from 'dp-api'

export const useShareStore = defineStore('ShareStore', () => {
    const state = reactive({
        shareList: <SimplifiedDocDetail[]>[]
    })
    async function getMineTypeShareList() {
        // const data = await DocumentThumbnailListGetApi(state.shareList.map((item:any) => item.id))
        return state.shareList.map((item:any) => {
            return {...item, readOnly: true}
        })
    }
    function updateShareList(list: SimplifiedDocDetail[]) {
        state.shareList = [...list]
        sessionStorage.setItem('shareList', JSON.stringify(state.shareList))
    }
    function addToShareList(list: SimplifiedDocDetail[], className: string) {
        if(!state.shareList) state.shareList = []
        list.forEach(item => {
            if(state.shareList.findIndex(i => {
                if(item.isFolder) return -1
                return i.id === item.id
            }) === -1) state.shareList.push(item)
        })
        sessionStorage.setItem('shareList', JSON.stringify(state.shareList))
    }

    function getUseWatermark(mimeType :string) {
        // check mintype is image, pdf or video
        return ['image', 'pdf', 'video'].includes(mimeType)
    }
    onMounted(() => {
        const data = sessionStorage.getItem('shareList')
        if(!!data) state.shareList = JSON.parse(data)
    })
    return {
        getUseWatermark,
        getMineTypeShareList,
        updateShareList,
        addToShareList,
        state
    }
})
