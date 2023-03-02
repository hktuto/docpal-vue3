
import {TABLE} from '../constant/tableColumn'

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
    prop ?: string,
    type ?: string,
}


export type TableColumnSetting = {
    [key:string] : TableColumnItem[]
}