// @ts-ignore

import { useEventSource } from '@vueuse/core'
import { watch } from 'vue'
export const useNotification = (token:string, username:string, messageChangeCB) => {
    const notiData = useState<any>('notiData');
    const notiError = useState<any>('notiError');
    const notiStatus = useState<any>('notiStatus')
    const notiClose = useState<any>('notiClose')
    function heartbeat() {
        console.log("heartbeat")
        useEventSource('/notification/api/v1/keepalive/_private/docpal/' + username, [], {
            withCredentials: true
        });

        const { status, data, error, close } = useEventSource('/notification/api/v1/receive/messages?username='+username, [], {
            withCredentials:true
        })
        notiClose.value = close
        notiStatus.value = status
        notiData.value = data
        notiError.value = error
    }
    

    onMounted(() => {
        if(close.value){
            close.value()
        }
        heartbeat()
    })

    watch(notiData, () => {
        if(!notiData.value) return
        const message = notiData.value as any
        const { messageJson } = JSON.parse(notiData.value)
        // 有messageJson且messageJson的heartbeat不为true才会更新数据
        if (!messageJson || !messageJson.heartbeat) {
            messageChangeCB()
        }
    })

    return {

    }
}