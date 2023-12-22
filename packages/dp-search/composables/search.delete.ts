// 没有用到,建议删除

import { ref } from 'vue';
import { watchDebounced } from '@vueuse/core'
type Command = {
    label:string,
    function: Function,
    trigger:Function
}

type SearchFilter = {
    paramsInTextSearch?: string
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
    currentPageIndex: number
}

export const useSearch = () => {

    const commands = ref<Command[]>([]);

    const searchParams = useState<SearchFilter>('searchParams',() => ({
        // paramsInTextSearch: [],
        // textSearchType: '',
        // folderType: '',
        // type: [],
        // modified: '',
        // authors: [],
        // collections: [],
        // tags: [],
        // size: '',
        pageSize: 20,
        currentPageIndex: 1
    }))

    const searchResult = useState('searchResult',() => ([]));

    async function search(){
        console.log({searchParams});
        
    }

    watchDebounced(searchParams, (newFilter, oldFilter) => {
        console.log(newFilter, oldFilter, '???????????');
        search()
    },{ debounce: 200, maxWait: 500 },)

    return {
        commands,
        searchResult,
        search,
        searchParams
    }
}