import {api} from '../';
import { pageParams, Response, paginationData } from '../model';
import { UserSetting, LoginRequest, LoginResponse, User } from '../model/user';
export type membershipAddParams = {
    groupId: string,
    userId: string,
}
export const GetSetting = async():Promise<UserSetting> => {
    return await api.get<Response<UserSetting>>('/docpal/user/setting').then((res:any) => JSON.parse(res.data.data))
}

export const UserSettingSaveApi = async(data:UserSetting) => {
    return await api.put('/docpal/user/setting',data).then(res => res.data.data)
}

export const Login = async(data: LoginRequest):Promise<LoginResponse> => {
    return await api.post<Response<LoginResponse>>('/auth/nuxeo/login',data).then(res => res.data.data)
}
export const isLdapModeApi = async()=> {
    return await api.get('/docpal/relation/isLdapMode').then(res => res.data.data);
}
export const Verify = async():Promise<User> => {
    return api.get<Response<User>>('/nuxeo/user/getApplication').then(res => res.data.data);
}
export const GetUserDetailApi = async (userId: string) => {
    return await api.get(`/nuxeo/user/${userId}`).then(res => res.data.data);
}
let userListStore = []
export const getUserListApi = async(refresh: boolean = false):Promise<User[]> => {
    if (userListStore.length > 0 && !refresh) return userListStore
    let response = await api.post<Response<User[]>>('/nuxeo/identity/users', {}).then(res => res.data.data);
    userListStore = [...response.sort((a,b)=> (a.username.localeCompare(b.username) ))]
    return userListStore
}

let conditions = []
export const getAllUsersApi = async(param: pageParams) => {
    const response = await api.post('/nuxeo/identity/getAllUsers', param).then(res => res.data.data);
    conditions = response.conditions
    return response.page
    // { entryList: response.entryList, totalSize: response.totalSize }
}
export const getConditionsApi = async() => {
    return conditions
}
export const getAllUserAndActiveCountApi = async() => {
    const response = await api.post('/nuxeo/identity/getLicenseUserNumAndActiveCount').then(res => res.data.data);
    return response
}
export const SetUserStatusApi = async(params) => {
    const response = await api.put('/nuxeo/user/status', params).then(res => res.data.data);
    return response
}
export const CreateUserApi = async(param) => {
    const response = await api.post('/nuxeo/identity/user', param).then(res => res.data.data);
    await addUserToGroupTraverse(param.groupList, param.userId)
    return response
}
const addUserToGroupTraverse = async(groupIds, userId) => {
    const pList = []
    for (const item of groupIds) {
        const pItem = MembershipAddApi({ groupId: item, userId })
        pList.push(pItem)
    }
    await Promise.all(pList)
}
export const PatchUserApi = async(param) => {
    return await api.patch('/nuxeo/identity/user', param).then(res => res.data.data);
}
export const PatchUserPasswordApi = async(param) => {
    return await api.patch(`/nuxeo/identity/user/password?userId=${param.userId}&password=${param.password}`).then(res => res.data.data);
}

export const ForgetPasswordApi = async(userId:string) => {
    return await api.post(`/nuxeo/user/forgetPassword`,{}, {params:{userId}}).then(res => res.data.data);
}


export const DeleteUserApi = async(param) => {
    return await api.delete('/nuxeo/identity/user', {data: param}).then(res => res.data.data);
}
export const MemberGroupGetApi = async(param) => {
    return await api.post('/nuxeo/identity/memberGroup', param).then(res => res.data.data);
}
export const MembershipAddApi = async(param: membershipAddParams) => {
    return await api.post('/nuxeo/identity/membership', param).then(res => res.data.data);
}
export const MembershipDeleteApi = async(param) => {
    return await api.delete('/nuxeo/identity/membership', { data: param }).then(res => res.data.data);
}
let groupListStore = []
export const GetGroupListApi = async(refresh: boolean = false) => {
    if (groupListStore.length > 0 && !refresh) return groupListStore
    let response = await api.post('/nuxeo/identity/groups', {}).then(res => res.data.data);
    groupListStore = [...response.sort((a,b)=> (a.name.localeCompare(b.name) ))]
    return groupListStore
}
export const CreateGroupApi = async(param) => {
    return await api.post('/nuxeo/identity/group', param).then(res => res.data.data);
}
export const PatchGroupApi = async(param) => {
    return await api.patch('/nuxeo/identity/group', param).then(res => res.data.data);
}
export const DeleteGroupApi = async(param) => {
    return await api.delete('/nuxeo/identity/group', { data: param }).then(res => res.data.data);
}
export const GetMemberListApi = async(param) => {
    return await api.post('/nuxeo/identity/member', param).then(res => res.data.data);
}
