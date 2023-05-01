// import { useAppStore } from './../../dp-stores/composables/app';
import { useSetting } from './../../dp-stores/composables/setting';

import {GetSetting, UserSettingSaveApi, Login, api, Verify, getUserListApi} from 'dp-api'
import { User, UserSetting } from 'dp-api/src/model/user'
export const useUser = () => {

    // @ts-ignore
    const appStore = useAppStore();    
    const isLogin = useState<boolean>('isLogin',() => false);
    const token = useState<string>('userToken', () => "");
    const refreshToken = useState<string>('refreshToken', () => "");
    const user = useState<User>('appUser');

    const userPreference = useState<UserSetting>('userPreference');
    const settingStore = useSetting()

    const userList = ref<User[]>([]);
    
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
                language: 'en-US',
                color: 'system',
                tableSettings: {}
            },
            {...userSetting}
        )
        appStore.state = 'ready';
        settingStore.init()
    }

    async function savePreference() {
        await UserSettingSaveApi(userPreference.value)
        
    }

    async function verify() {
        try {
            user.value = await Verify();
            isLogin.value = true;
            await getUserSetting();
        } catch (error) {
            appStore.state = 'needAuth';
            isLogin.value = false,
            token.value = "";
            refreshToken.value = "";
            if(sessionStorage){
                sessionStorage.removeItem('token');
            }
        }
    }

    async function login(username:string, password: string):Promise<{isRequired2FA:boolean}> {
        const {access_token, refresh_token, isRequired2FA} = await Login({
            username,  password
        })
        token.value = access_token,
        refreshToken.value = refresh_token
        sessionStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
        if(!isRequired2FA) {
            await verify();
        }
        return {isRequired2FA}
    }

    async function logout(){
        await useFetch('/api/session', {
            method:'DELETE'
        });
        isLogin.value = false;
        token.value = "";
        refreshToken.value = "";
        appStore.state = 'needAuth';
        if(sessionStorage){
            sessionStorage.removeItem('token');
        };
        localStorage.removeItem('refreshToken');
    }

    async function getUserList() {
        const list = await getUserListApi();
        userList.value = list;
    }

    function forgetPassword() {
        appStore.state = 'forgetPassword';
    }

    return {
        // data
        token,
        user,
        userPreference,
        // function
        login,
        verify,
        logout,
        getUserSetting,
        savePreference,
        getUserList,
        userList,
        forgetPassword
    }
}