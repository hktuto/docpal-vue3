
export type pageParams = {
    pageIndex?: number,
    pageNum?: number,
    pageSize : number,
    [key: string]: any
}
export async function api<T>(url: string, options = {}):Promise<T> {
    // @ts-ignore
    const { token } = useUser();
    const { data, error, refresh } = await useFetch<T>(url, Object.assign({
        baseURL: '/api',
        headers:{
            'Authorization': 'Bearer ' + token.value
        }
    },options));
    if(data.value) {
        return data.value as T
    }
    if(error.value){
        throw new Error('fetch fail')
    }
    throw new Error('no data return');

}