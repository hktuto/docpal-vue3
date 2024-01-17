// @ts-ignore

import { useEventSource } from '@vueuse/core'
import { watch } from 'vue'

export type MessageHandler = {
    name: string,
    handler: (data: any) => void
}

export const useNotification = () => {
    
    const messageHandlers = useState<MessageHandler[]>('messageHandlers', () => shallowRef<any[]>([]))

    const Cookies = useCookie('messageToken')
    
    const notiData = useState<string | null>('notiData');
    const notiError = useState<Event | null>('notiError');
    const notiStatus = useState<"OPEN" | "CONNECTING" | "CLOSED">('notiStatus')
    const notiClose = useState<() => void>('notiClose')
    let interval: any = null
    function connect() {
        console.log('connect event')
        const { getUserId, token } = useUser()
        Cookies.value = token.value || ''
        const { status, data, error, close } = useEventSource('/notification/api/v1/receive/messages?username='+getUserId(), [], {
            withCredentials:true
        })
        notiClose.value = close
        notiStatus.value = status
        notiData.value = data
        notiError.value = error
    }
    function disconnect(){
        console.log('disconnect event')
        if(notiClose.value){
            notiClose.value()
            
        }
    }
    

    return {
        messageHandlers,
        notiData,
        notiError,
        notiStatus,
        connect,
        disconnect
    }
}