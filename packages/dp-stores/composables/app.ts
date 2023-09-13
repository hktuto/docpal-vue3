import { useDebounceFn } from "@vueuse/core";
import { defineStore } from 'pinia'
type AppState = 'loading' | 'language' | 'needAuth' | 'ready' | 'offline' | 'forgetPassword' | 'defaultLogin'
import { useOnline } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
    const router = useRouter()
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
        // displayState.value = state.value
        setDisplayState(state.value)
    }, 500)
    const setDisplayState = (value: AppState) => {
        if(state.value === value) state.value = value
        displayState.value = value
        if(value === 'needAuth') {
            const superAdmin = sessionStorage.getItem('superAdmin')
            if(superAdmin === 'superAdmin') {
                
                
                displayState.value = 'defaultLogin' 
                return
            }
            router.go(0)
            // window.location.reload()
        }
    }
    const appLoadingList = ref<any[]>([]);
    async function appInit(){
        for await ( const item of appLoadingList.value) {
            state.value = item.key;
            await item.function;
        }
    }

    watch(state, (_newState, oldState ) => {
        dpLog(_newState, displayState.value)
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
        setDisplayState,
        appLoadingList,
        appInit,
    }

})
