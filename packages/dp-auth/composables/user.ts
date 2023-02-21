import { useAppStore } from './../../dp-stores/composables/app';
import { Login, Verify, GetSetting, User } from '../../dp-stores/utils/userApi';


export const useUser = () => {

    const appStore = useAppStore();    
    const isLogin = useState<boolean>('isLogin',() => false);
    const token = useState<string>('userToken', () => "");
    const refreshToken = useState<string>('refreshToken', () => "");
    const user = useState<User>('appUser');

    const userPreference = useState('userPreference');
    
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
            },
            userSetting
        )
        appStore.state.value = 'ready';
    }

    async function verify() {
        try {
            user.value = await Verify();
            isLogin.value = true;
            await getUserSetting();
        } catch (error) {
            appStore.state.value = 'needAuth';
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
        appStore.state.value = 'needAuth';
        if(sessionStorage){
            sessionStorage.removeItem('token');
        }
        userPreference.value = null;
    }

    return {
        // data
        token,
        user,
        // function
        login,
        verify,
        logout,
    }
}