import {api} from '../';
import { UserSetting, LoginRequest, LoginResponse, User } from '../model/user';

export const GetSetting = async():Promise<UserSetting> => {
    return await api.get<UserSetting>('/docpal/user/setting').then(res => res.data)
}

export const UserSettingSaveApi = async(data:UserSetting) => {
    return await api.put('/docpal/user/setting',data).then(res => res.data)
}

export const Login = async(data: LoginRequest):Promise<LoginResponse> => {
    return await api.post<LoginResponse>('/auth/nuxeo/login',data).then(res => res.data)
}

export const Verify = async():Promise<User> => {
    return api.get<User>('/nuxeo/user/getApplication').then(res => res.data);
}