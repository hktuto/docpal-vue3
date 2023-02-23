import { ref } from 'vue';

type Command = {
    label:string,
    function: Function,
    trigger:Function
}

type SearchFilter = {
    paramsInTextSearch?: string[]
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

    return {
        commands
    }
}