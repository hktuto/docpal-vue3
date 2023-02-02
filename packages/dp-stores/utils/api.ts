
export function api<T>(url: string, options = {}) {
    // @ts-ignore
    const { token } = useUser();
    return useFetch<T>(url, Object.assign({
        baseURL: '/docpalEndpoint',
        headers:{
            'Authorization': 'Bearer ' + token.value
        }
    },options))
}