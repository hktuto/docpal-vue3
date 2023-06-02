export type sfloderDetail = {
    id: string,
    json_value: string,
    name: string
}

type Command = {
    label:string,
    function: Function,
    trigger:Function
}

type SearchFilter = {
    paramsInTextSearch?: string[] | string,
    textSearchType?: string,
    // paramsInTextSearch?: string[][]
    or?: string[]
    type?: string[]
    modified?: string
    authors?: string[]
    collections?: string[]
    tags?: string[]
    size?: string,
    // size?: string[],
    folderType?: string,

    pageSize: number,
    currentPageIndex: number,
    keyword: string
}
