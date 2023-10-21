// @ts-ignore
import dialog from '../components/nissin/dialog.vue';
import Vue from 'vue'
export default function() {
    Vue.component('NissinDialog', dialog);
    const item = {
        category:"business_processes",
        id:"test",
        key: "nissinArtworkContentApproval",
        name: "nissinArtworkContentApproval",
        // @ts-ignore
        component: "NissinDialog",
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
}