export const dplog = (...args:any) => {
    const {dev} = useRuntimeConfig()
    if(dev){
        console.log(...args)
    }
}