import mem from "mem";
import { api } from 'dp-api'

export const refreshTokenFn = async () => {
    console.log("refresh token")
    const refreshToken = localStorage.getItem('refreshToken');
    const Cookies = useCookie('docpal-user')
    const {user} = useUser()
    try {
      localStorage.setItem("token", refreshToken as string);
      // header设置无效
      const {access_token, refresh_token} = await api.post('/auth/nuxeo/token',{},{
            headers:{
                Authorization : 'Bearer ' + refreshToken
            }
        }).then( res => { console.log(res.data); return res.data.data})

      if (!access_token) {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");
      }
      
      Cookies.value = JSON.stringify(user.value) 
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("token", access_token);
      return {
        refresh_token, access_token
      };
    } catch (error) {
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
    }
  };

  const maxAge = 10000;

  export const memoizedRefreshToken = mem(refreshTokenFn, {
    maxAge,
  });
