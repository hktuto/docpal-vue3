import { useDebounceFn } from "@vueuse/core";
import { defineStore } from 'pinia'
type AppState = 'loading' | 'language' | 'needAuth' | 'ready' | 'offline' | "forgetPassword"
import { useOnline } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {

    const state = ref<AppState>('loading');
    const noEvent = ref(false);
    const displayState = ref<AppState>('loading');

    const loadingEl = ref<HTMLElement>();
    const needAuthEl = ref<HTMLElement>();
    const readyElement = ref<HTMLElement>();

    
    const online = useOnline();
    const user = useUser();

    const fadeOutClass = "fadeOut"

    const debounceChangeState = useDebounceFn(() => {
        displayState.value = state.value
    }, 500)

    const appLoadingList = ref<any[]>([]);
    async function appInit(){
        for await ( const item of appLoadingList.value) {
            state.value = item.key;
            await item.function;
        }
    }

    watch(state, (_newState, oldState ) => {
        dplog(_newState)
        switch(oldState) {
            case 'loading':
                if(loadingEl.value) {
                    loadingEl.value.classList.add(fadeOutClass)
                }
                break;
            case 'needAuth':
                if(needAuthEl.value) {
                    needAuthEl.value.classList.add(fadeOutClass)
                }
                break;
            case 'ready' :
                if(readyElement.value) {
                    readyElement.value.classList.add(fadeOutClass)
                }
                break;
        }
        debounceChangeState();
    })

    watch(online, async(bool) => {
        if(!bool) {
            state.value = 'offline';
        }else{
            await appInit();
            await user.verify();
        }
    })
    return {
        state,
        noEvent,
        loadingEl,
        needAuthEl,
        readyElement,
        displayState,

        appLoadingList,
        appInit
    }
    
})