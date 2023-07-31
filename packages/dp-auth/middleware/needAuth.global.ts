export default defineNuxtRouteMiddleware((to, from) => {
    const {isLogin} = useUser();
    // step public route list 
    const publicRouteList = ['login', 'register', 'forgot-password', 'reset-password'];
    // step check route is public or not
    if (publicRouteList.includes(to.path)) {
        return;
    }
    // step check user is login or not
    if (!isLogin.value) {
        return navigateTo('/login');
    }

})