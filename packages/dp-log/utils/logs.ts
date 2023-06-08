


export const dpLog = (...args:any) => {
    const {public:{mode}} = useRuntimeConfig()
    if(mode === 'development'){
        console.log(...args)
    }
    // @ts-ignore
    const userLog = useLog();
    userLog.setUserLog(...args);
}