


export default defineNuxtPlugin(nuxtApp => {
    const { messageHandlers } = useNotification()
    
    function notificationHandler(message:any) {
        // TODO : handle different message type
        new window.Notification( "New Message", {
            icon: "http://localhost:3000/images/logo-white_logo-light.svg",
            body: "new message body"
        }).onclick = () => {
            console.log("notification click")
        }
        
    }

    messageHandlers.value.push({
        name:'nativeNotification',
        handler:notificationHandler
    })

})