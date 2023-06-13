import mem from "mem";
import { api } from 'dp-api'

const refreshTokenFn = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const Cookies = useCookie('docpal-user')
    const {user} = useUser()
    try {
      const {access_token, refresh_token} = await api.post('/auth/nuxeo/token',{},{
            headers:{
                Authorization : 'Bearer ' + refreshToken
            }
        }).then( res => { console.log(res.data); return res.data})

      if (!access_token) {
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
      }
      
      Cookies.value = JSON.stringify(user.value) 
      localStorage.setItem("refreshToken", refresh_token);
      sessionStorage.setItem("token", access_token);
      return {
        refresh_token, access_token
      };
    } catch (error) {
      localStorage.removeItem("refresh_token");
      sessionStorage.removeItem("token");
    }
  };

  const maxAge = 10000;

  export const memoizedRefreshToken = mem(refreshTokenFn, {
    maxAge,
  });
