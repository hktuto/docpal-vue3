

export default defineNuxtPlugin( () => {
  const {loginHandlers, logoutHandlers, isLogin} = useUser()

  watch(isLogin, () => {
    if(isLogin.value) {
      loginHandlers.value.forEach(handler => {
        handler.handler()
      })
    }else{
      logoutHandlers.value.forEach(handler => {
        handler.handler()
      })
    }
  })

})
