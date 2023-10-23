// @ts-ignore
import NissinDialog from '~/components/nissin/dialog.vue';

export default defineNuxtPlugin(nuxtApp =>  {
    const item = {
        category:"business_processes",
        id:"test",
        key: "nissinArtworkContentApproval",
        name: "nissinArtworkContentApproval",
        // @ts-ignore
        component: NissinDialog,
        page: "/nissinArtworkContentApproval"
    }
    // @ts-ignore
    if(window.extraWorkflow) {
        // @ts-ignore
        window.extraWorkflow.push(item)
    }else {
        // @ts-ignore
        window.extraWorkflow = [item]
    }
    
    
    // add event listener to pinia store
    // 
})