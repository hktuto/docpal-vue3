// import { useAppStore } from './../../dp-stores/composables/app';
import { ElMessage } from 'element-plus'
import { useSetting } from './../../dp-stores/composables/setting';
import { useLanguage } from './../../dp-stores/composables/language'
import { GetSetting, UserSettingSaveApi, getKeyCloakPropertyApi, Login, api, Verify, getUserListApi, isLdapModeApi} from 'dp-api'
import { User, UserSetting } from 'dp-api/src/model/user'
import Keycloak from 'keycloak-js'
let dpKeyCloak: any
export const useUser = () => {
    const route = useRoute()
    const router = useRouter()
    const publicRouteList = ['/resetPassword', '/resetPassword/']
    const Cookies = useCookie('docpal-user')
    // @ts-ignore
    const appStore = useAppStore();
    const isLogin = useState<boolean>('isLogin',() => false);
    const token = useState<string>('userToken', () => "");
    const refreshToken = useState<string>('refreshToken', () => "");
    const user = useState<User>('appUser');

    const userPreference = useState<UserSetting>('userPreference');
    const settingStore = useSetting()
    const isLdapMode = useState<boolean>('isLdapMode',() => false);

    const userList = useState<User[]>('userList', () => ([]));
    const publicPages = ['/forgetPassword', '/resetPassword', '/language', '/error/503', '/error/404']
    const { public: { endPoint } } = useRuntimeConfig();
    const { loadLanguage } = useLanguage()
    const colorModeOption = [
        {
            id: '1',
            value: 'system',
            name: 'System',
        },
        {
            id: '2',
            value: 'light',
            name: 'Light',
        },
        {
            id: '3',
            value: 'dark',
            name: 'Dark',
        },
    ]

    const uiSize = [
        {
            label: 'small',
            value: '14px',
        },
        {
            label: 'normal',
            value: '18px',
        },
        {
            label: 'large',
            value: '20px',
        },
    ]

    async function getUserSetting() {
        const userSetting = await GetSetting()
        
        const userSizeValid = uiSize.find((c) => c.value === userSetting.size);
        if(!userSizeValid) {
          delete userSetting.size;
        }
        const userColorValid = colorModeOption.find( c => c.value === userSetting.color);
        if(!userColorValid) {
          delete userSetting.color;
        }
        userPreference.value = Object.assign(
            {
                size: '14px',
                folderView: 'tree',
                language: navigator.language,
                color: 'system',
                tableSettings: {}
            },
            {...userSetting}
        )
        appStore.setDisplayState('ready') 
        settingStore.init()
        loadLanguage(getDefaultLanguage())
    }
    function getDefaultLanguage() {
        return userPreference?.value?.language || navigator.language
        // return userPreference?.value?.language || 'zh' 
    }
    async function savePreference() {
        await UserSettingSaveApi(userPreference.value)

    }
    async function verify() {
        try {
            const token = localStorage.getItem('token')
            if(!token) throw new Error("no token");
            user.value = await Verify();
            Cookies.value = JSON.stringify(user.value)
            isLogin.value = true;
            await getUserSetting();
        } catch (error) {
            const path = route.path
            if(path && publicRouteList.includes(path)) {
                appStore.setDisplayState('ready');
            } else {
                appStore.setDisplayState('needAuth');
            }
            isLogin.value = false,
            token.value = "";
            refreshToken.value = "";
            if(sessionStorage){
                sessionStorage.removeItem('token');
            }
        }
    }
    async function keycloakLogin() {
        console.log('keycloakLogin', {dpKeyCloak});
        try {
            const authenticated = await dpKeyCloak.init({onLoad: 'login-required'})
            if(!authenticated) {
                throw new Error("unAuth");
            } 
            else {
                await callApi()
                setTimeout(() => {
                    router.push('/browse')
                }, 500)
            }
        } catch (error) {
            // window.location.reload();
            isLogin.value = false,
            token.value = "";
            refreshToken.value = "";
            sessionStorage.removeItem('token');
        }
    }
    async function callApi() {
        // 使用令牌来调用您的 API
        try {
            await dpKeyCloak.updateToken(10) // Refresh token if it's less than 10 seconds from expiring
            await appStore.appInit();
            localStorage.setItem('token', dpKeyCloak.token);
            const data = await api.get('/docpal/systemfeature/keycloak-token-verification').then( res => { 
                                    if(!res.data || !res.data.data) {
                                        handleKeycloakLoginFail()
                                    }
                                    return res.data.data 
                                })
            if (!data) return
            token.value = data.access_token 
            refreshToken.value = data.refresh_token
            localStorage.setItem('token', token.value);
            localStorage.setItem('refreshToken', refreshToken.value);
            user.value = await Verify();
            Cookies.value = JSON.stringify(user.value)
            isLogin.value = true;
            api.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
            await getUserSetting();
            
            appStore.setDisplayState('ready');
        } catch (error) {
            handleKeycloakLoginFail()
        }
    }
    function handleKeycloakLoginFail () {
        setTimeout(() => {
            router.push('/error/503?message=message')
            appStore.setDisplayState('ready');
        }, 200)
    }
    async function login(username:string, password: string):Promise<{isRequired2FA:boolean}> {
        const {access_token, refresh_token, isRequired2FA} = await Login({
            username,  password
        })
        if(route.path && publicRouteList.includes(route.path)) {
            router.push('/browse')
        }
        token.value = access_token,

        // Cookies.value = access_token || ''
        refreshToken.value = refresh_token
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
        if(!isRequired2FA) {
            await verify();
        }
        return {isRequired2FA}
    }
    // docpal-user
    function logout(){
        if(!isLogin.value) return
        isLogin.value = false;
        token.value = "";
        refreshToken.value = "";
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        if(dpKeyCloak && dpKeyCloak.token) dpKeyCloak.logout()
        else{
            appStore.setDisplayState('needAuth')
            sessionStorage.clear()
        } 
    }
    function logoutKeyCloak() {
        if(dpKeyCloak && dpKeyCloak.token) {
            dpKeyCloak.logout()
        }
    }
    async function getUserList() {
        const list = await getUserListApi();
        userList.value = list;
    }
    /**
     * public page 与 default login 需要提前 appInit
     * keycloakLogin 在登陆成功后再 appInit
     * @returns 
     */
    async function beforeLogin(goHome: boolean) {
        console.log(isLogin.value, 'isLogin');
        
        if(isLogin.value) {
            appStore.setDisplayState('ready') 
            return
        }
        const _superAdmin = sessionStorage.getItem('superAdmin')

        // @ts-ignore
        const superAdmin = route.query.superAdmin
        if(!!publicPages.find(item => route.path.includes(item)) && !goHome) {
            console.log('publicPages', route.path, publicPages);
            
            await appStore.appInit();
            appStore.setDisplayState('ready') 
        }else if(superAdmin === 'superAdmin' && endPoint === 'admin' || superAdmin === 'clientSuperAdmin' || _superAdmin === 'superAdmin') {
            console.log('superAdmin');
            await appStore.appInit();
            appStore.setDisplayState('defaultLogin') 
            sessionStorage.setItem('superAdmin', 'superAdmin')
            setIsLdapMode(await getIsLdapMode())
            await verify()
            router.push('/browse')
        } else {
            if(!dpKeyCloak) {
                const result = await setKeyCloak()
                if(!result) return 
            }
            sessionStorage.removeItem('superAdmin')
            await keycloakLogin();
        }
    }
    async function setKeyCloak() {
        const config = await getKeyCloakPropertyApi()
        if(!config.keyCloakProperty.url ||
           !config.keyCloakProperty.realm ||
           !config.keyCloakProperty.clientId ||
           !config.keyCloakProperty.sslRequired) {
            // @ts-ignore
            ElMessage.error($i18n.t('dpTip_keycloakError'))
            return false
        }

        setIsLdapMode(config.isLdap)
        dpKeyCloak = new Keycloak({
            "url": config.keyCloakProperty.url,
            "realm": config.keyCloakProperty.realm, // ldap: docpal_third_party
            "clientId": config.keyCloakProperty.clientId,
            // @ts-ignore
            "ssl-required": config.keyCloakProperty.sslRequired,
            "public-client": config.keyCloakProperty.publicClient,
            "confidential-port": config.keyCloakProperty.confidentialPort
        })

        return true
    }
    function getUserId () {
        try {
            return user.value.userId || user.value.username
        } catch (error) {
            return ''
        }
    }
    async function setIsLdapMode (isLdap: boolean) {
        isLdapMode.value = isLdap
    }
    function getIsLdapMode () {
        return isLdapMode.value
    }
    return {
        // data
        token,
        user,
        publicPages,
        userPreference,
        isLogin,
        isLdapMode,
        // function
        login,
        verify,
        logout,
        logoutKeyCloak,
        getUserSetting,
        savePreference,
        getUserList,
        getUserId,
        setIsLdapMode,
        getIsLdapMode,
        getDefaultLanguage,
        userList,
        beforeLogin
    }
}
