// @ts-ignore

import { useEventSource } from '@vueuse/core'
import { watch } from 'vue'
export const useNotification = (username:string, messageChangeCB) => {
    const notiData = useState<any>('notiData');
    const notiError = useState<any>('notiError');
    const notiStatus = useState<any>('notiStatus')
    const notiClose = useState<any>('notiClose')
    function heartbeat() {
        console.log("no heartbeat ping")
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

    watch(notiData, () => {
        if(!notiData.value) return
        const data = JSON.parse(notiData.value)
        console.log(data, 'notiData')
        if(data.event === 'ping') return
        messageChangeCB()
    })

    return {
        start
    }
}