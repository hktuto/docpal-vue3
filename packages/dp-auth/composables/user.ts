// import { useAppStore } from './../../dp-stores/composables/app';
import { useSetting } from './../../dp-stores/composables/setting';
import {GetSetting, UserSettingSaveApi, Login, api, Verify, getUserListApi, isLdapModeApi} from 'dp-api'
import { User, UserSetting } from 'dp-api/src/model/user'


export const useUser = () => {
    // @ts-ignore
    const keycloak = window.$keycloak
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
    const errorPages = ['/error/503','/error/503/','/error/404','/error/404/']
    const publicPages = ['/forgetPassword','/forgetPassword/', '/resetPassword', '/resetPassword/']
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
        isLdapMode.value = await isLdapModeApi()
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
                language: 'en-US',
                color: 'system',
                tableSettings: {}
            },
            {...userSetting}
        )
        appStore.setDisplayState('ready') 
        settingStore.init()
    }

    async function savePreference() {
        await UserSettingSaveApi(userPreference.value)

    }
    async function verify(path: string) {
        try {
            const token = localStorage.getItem('token')
            if(!token) throw new Error("no token");
            user.value = await Verify();
            Cookies.value = JSON.stringify(user.value)
            isLogin.value = true;
            await getUserSetting();
        } catch (error) {
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
        console.log('keycloakLoginkeycloakLoginkeycloakLogin');
        
        try {
            const authenticated = await keycloak.init({onLoad: 'login-required'})
            if(!authenticated) {
                throw new Error("unAuth");
            } else {
                callApi()
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
        await keycloak.updateToken(10) // Refresh token if it's less than 10 seconds from expiring
        const data = await api.get('/docpal/systemfeature/keycloak-token-verification',{ 
                                headers: {
                                    Authorization : 'Bearer ' + keycloak.token
                                }
                            }).then( res => { return res.data.data })

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
        isLogin.value = false;
        token.value = "";
        refreshToken.value = "";
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        if(keycloak.token) keycloak.logout()
        else{
            appStore.setDisplayState('needAuth')
            sessionStorage.clear()
        } 
    }

    async function getUserList() {
        const list = await getUserListApi();
        userList.value = list;
    }

    function getUserId () {
        try {
            return user.value.userId || user.value.username
        } catch (error) {
            return ''
        }
    }
    function getIsLdapMode () {
        return isLdapMode.value
    }
    return {
        // data
        token,
        user,
        errorPages,
        publicPages,
        userPreference,
        isLogin,
        isLdapMode,
        // function
        login,
        verify,
        keycloakLogin,
        logout,
        getUserSetting,
        savePreference,
        getUserList,
        getUserId,
        getIsLdapMode,
        userList,
    }
}
