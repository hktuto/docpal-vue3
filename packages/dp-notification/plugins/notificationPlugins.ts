export default defineNuxtPlugin(nuxtApp => {
    const {loginHandlers, logoutHandlers } = useUser()
    const { connect, disconnect, messageHandlers, notiData, notiError} = useNotification()

    loginHandlers.value.push({
        name: 'notification',
        handler: connect
    })

    logoutHandlers.value.push({
        name: 'notification',
        handler: disconnect
    })

    watch(notiData, () => {
        if(!notiData.value) return
        messageHandlers.value.forEach((handler) => {
            handler.handler(JSON.parse(notiData.value))
        })
        // messageChangeCB(JSON.parse(notiData.value))
    })

    watch(notiError, () => {
        if(!notiError.value) return
        if(interval) clearInterval(interval)
        console.log('notiError：', notiError.value)
        interval = setInterval(() => {
            console.log('notiError：setInterval,', notiError.value)
            // start()
            clearInterval(interval)
        }, 10000)
    })


})