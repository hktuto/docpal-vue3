import { TableColumnSetting } from "./Table"

export type UserSetting = {
    size?: string,
    color?: string,
    language?: string,
    tableSettings?: TableColumnSetting
}



export type User = {
    username: string,
    userId: string,
    lastName: string,
    firstName: string
}




export type LoginResponse = {
    access_token: string,
    refresh_token: string,
    isRequired2FA: boolean
}
export type LoginRequest = {
    username: string,
    password: string
}
