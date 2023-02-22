import { ref } from 'vue';

type Command = {
    label:string,
    function: Function,
    trigger:Function
}

export const useSearch = () => {

    const commands = ref<Command[]>([]);

    return {
        commands
    }
}