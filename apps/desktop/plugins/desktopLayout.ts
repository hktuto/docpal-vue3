import {TauriHeader} from "#components";


export default defineNuxtPlugin(nuxtApp => {
    const { headerSlots } = useLayout()

    headerSlots.value.push({
        name: "tauri",
        order: 0,
        component: TauriHeader
    })


})