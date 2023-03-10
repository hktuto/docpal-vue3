


export const dplog = (...args:any) => {
    const {dev} = useRuntimeConfig()
    if(dev){
        console.log(...args)
    }
    // @ts-ignore
    const userLog = useLog();
    userLog.setUserLog(...args);
}