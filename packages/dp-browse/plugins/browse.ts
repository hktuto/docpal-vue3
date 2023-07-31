import DocDetail from '~/components/browse/Detail.vue'



export default defineNuxtPlugin(nuxtApp => {
    const { globalSlots } = useLayout()
    
    globalSlots.value.push({
        name: "docDetail",
        order: 0,
        component: DocDetail
    })
    
    
})