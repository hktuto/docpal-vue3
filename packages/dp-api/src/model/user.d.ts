export type UserSetting = {
    size?: string,
    color?: string,
    language?: string,
    tableSettings?: TableColumnSetting
}

export type TableColumnSetting = {
    [key:string] : TableColumnItem[]
}

export type User = {
    username: string,
    userId: string
}
export type TableColumnItem = {
    id?: string | any,
    property?: string,
    label?: string,
    sortable?:boolean,
    slot ?: string,
    align ?: string,
    width ?: string | number,
    defaultValue ?: any,
    headerAlign ?: string,
    isFilter ?: boolean,
    canNotDelete ?:boolean
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
