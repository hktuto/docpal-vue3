// @ts-ignore

import { useEventSource } from '@vueuse/core'
import { watch } from 'vue'
export const useNotification = (username:string, messageChangeCB) => {
    const notiData = useState<any>('notiData');
    const notiError = useState<any>('notiError');
    const notiStatus = useState<any>('notiStatus')
    const notiClose = useState<any>('notiClose')
    const { isLogin, token } = useUser();
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
    watch(notiError, () => {
        console.log(notiError, 'notiError')
        notiClose.value()
        heartbeat()
    })
    watch(notiData, () => {
        if(!notiData.value) return
        messageChangeCB()
    })
    watch( () => isLogin.value, (newValue) => {
        if(newValue) {
            console.log(newValue, isLogin.value);
            // notificationStore.value = useNotification(userId, messageChange)
            // notificationStore.value.start()
        }
    }, {
        immediate:true 
    })
    onMounted( async() => {
       console.log('hello onMounted')
    })
    return {
        start
    }
}