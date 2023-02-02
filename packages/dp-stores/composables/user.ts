import { api } from '../utils/api';


export type User = {
    username: string,
    userId: string,
    [key:string] : any
}

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
        const {data:userSetting} = await api<any>('/docpal/user/setting')
        const userSizeValid = uiSize.find((c) => c.value === userSetting.value.size);
        if(!userSizeValid) {
          delete userSetting.value.size;
        }
        const userColorValid = colorModeOption.find( c => c.value === userSetting.value.color);
        if(!userColorValid) {
          delete userSetting.value.color;
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
        const { data, error } = await api<User>('/nuxeo/user/getApplication', {
            pick:['username','userId']
        });
        if(error.value){
            appStore.state.value = 'needAuth';
            isLogin.value = false,
            token.value = "";
            refreshToken.value = "";
            return;
        }
        user.value = data.value as User;
        isLogin.value = true;
        await getUserSetting();
    }


    async function login(username:string, password: string):Promise<{isRequired2FA:boolean}> {
        const { data, error } = await api<any>('/auth/nuxeo/login',{
            method:'post',
            pick:['access_token','refresh_token','isRequired2FA'],
            body:{
                username,  password
            }
        })
        if(error.value){
            console.log(error.value)
            throw new Error('fail');
        }
        console.log(data.value)
        token.value = data.value.access_token,
        refreshToken.value = data.value.refresh_token
        await useFetch('/api/session', {
            method:'PATCH',
            body:{
                access_token:token.value
            }
        })
        if(!data.value.isRequired2FA) {
            await verify();
        }
        return {
            isRequired2FA: data.value.isRequired2FA
        }
    }

    async function logout(){
        await useFetch('/api/session', {
            method:'DELETE'
        });
        isLogin.value = false;
        token.value = "";
        refreshToken.value = "";
        appStore.state.value = 'needAuth';
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