export * from './user.d';
export * from './document.d'
export * from './search.d'
export * from './setting.d'
export * from './workflow.d'
export * from './Table'
export * from './public-share.d'
export type pageParams = {
    page ?: number,
    pageIndex ?: number,
    currentPageIndex ?: number,
    pageNum ?: number,
    size ?: number,
    pageSize ?: number,
    [key: string]: any
}

export type paginationResponse= {
    code: number,
    data: paginationData,
    message: string,
    result: boolean
}
export type paginationData = {
    entryList: any[],
    totalSize: number,
    pageSize ?: number,
    pageIndex ?: number,
    [key: string]: any
}
export type paginationResponseData= {
    entryList: any[],
    totalSize: number,
}