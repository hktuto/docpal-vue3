// @ts-ignore
import {onMounted, useState} from '#import';
import { useEventSource } from '@vueuse/core'
import { watch } from 'vue'
export const useNotification = (token:string, username:string, messageChangeCB) => {

    
    useEventSource('/notification/api/v1/keepalive/_private/docpal/'+username, [], {
        withCredentials:true
    })
    const { status, data, error, close } = useEventSource('/notification/api/v1/receive/messages?username='+username, [], {
        withCredentials:true
    })

    watch(data, () => {
        if(!data.value) return
        const message = data.value as any
        const { messageJson } = JSON.parse(data.value)
        if (!messageJson || !messageJson.heartbeat) {
            messageChangeCB()
        }
    })

    return {

    }
}