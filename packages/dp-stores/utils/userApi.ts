export type LoginResponse = {
    access_token: string,
    refresh_token: string,
    isRequired2FA: boolean
}
export type LoginRequest = {
    username: string,
    password: string
}
/**
 * @param Obj username, password
 * @returns 'access_token','refresh_token','isRequired2FA'
 */
export const Login = async({username, password}:LoginRequest):Promise<LoginResponse> => {
    return api<LoginResponse>('/auth/nuxeo/login',{
        method:'post',
        pick:['access_token','refresh_token','isRequired2FA'],
        body:{
            username,  password
        }
    })
}


export type User = {
    username: string,
    userId: string
}
/**
 * Verify user from header token
 * @returns User
 */
export const Verify = async():Promise<User> => {
    return api<User>('/nuxeo/user/getApplication', {
        method: 'GET',
        pick:['username','userId', 'firstName', 'lastName', 'email']
    });
}

/**
 * Get User Setting from api
 */
import{ TableColumnSetting } from '../models/TableColumnSetting'
export type UserSetting = {
    size?: string,
    color?: string,
    language?: string,
    tableSettings?: TableColumnSetting
}
export const GetSetting = async():Promise<UserSetting> => {
    return await api<UserSetting>('/docpal/user/setting')
}
export const UserSettingSaveApi = async(body:UserSetting) => {
    try {
        return await api<UserSetting>('/docpal/user/setting', {
            method:'PUT' ,
            body,
        })
    } catch (error) {
        return false
    }
}


