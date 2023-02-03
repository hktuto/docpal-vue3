import { useDebounceFn } from "@vueuse/core";

type AppState = 'loading' | 'needAuth' | 'ready' 

export const useAppStore = () => {

    const state = useState<AppState>('appState', () => 'loading');

    const displayState = useState<AppState>('displayState', () => 'loading');

    const loadingEl = ref<HTMLElement>();
    const needAuthEl = ref<HTMLElement>();
    const readyElement = ref<HTMLElement>();

    const fadeOutClass = "fadeOut"

    const debounceChangeState = useDebounceFn(() => {
        displayState.value = state.value
    }, 1000)

    watch(state, (_newState, oldState ) => {
        console.log(_newState, oldState)
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

    return {
        state,
        loadingEl,
        needAuthEl,
        readyElement,
        displayState
    }
    
}