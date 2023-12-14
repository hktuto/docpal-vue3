// @ts-ignore

import { useEventSource } from '@vueuse/core'
import { watch } from 'vue'
export const useNotification = (username:string, messageChangeCB) => {
    const notiData = useState<any>('notiData');
    const notiError = useState<any>('notiError');
    const notiStatus = useState<any>('notiStatus')
    const notiClose = useState<any>('notiClose')
    let interval: any = null
    function heartbeat() {
        // useEventSource('/notification/api/v1/keepalive/_private/docpal/' + username, [], {
        //     withCredentials: true
        // });

        const { status, data, error, close } = useEventSource('/notification/api/v1/receive/messages?username='+username, [], {
            withCredentials:true
        })
        notiClose.value = close
        notiStatus.value = status
        notiData.value = data
        notiError.value = error
    }
    
    function start() {
        if(notiClose.value){
            notiClose.value()
        }
        heartbeat()
    }
    watch(() => notiError.value, () => {
        if(!notiError.value) return
        if(interval) clearInterval(interval)
        console.log('notiError：', notiError.value)
        interval = setInterval(() => {
            console.log('notiError：setInterval,', notiError.value)
            // start()
            clearInterval(interval)
        }, 10000)
    })
    watch(notiData, () => {
        if(!notiData.value) return
        messageChangeCB(notiData.value)
    })
    onMounted(() => {
        start()
    })
    return {
        start
    }
}