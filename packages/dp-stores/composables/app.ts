
type AppState = 'loading' | 'needAuth' | 'ready' 

export const useAppStore = () => {

    const state = useState<AppState>('appState', () => 'loading');


    return {
        state
    }
    
}