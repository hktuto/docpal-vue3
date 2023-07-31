import RelatedInfo from '~/components/related/info.vue'



export default defineNuxtPlugin(nuxtApp => {
    const { infoSlots } = useBrowse()

    infoSlots.value.push({
        name: "rightDetail_related",
        order: 0,
        component: RelatedInfo
    })

    const { globalSlots } = useLayout()

    globalSlots.value.push({
        name: "rightDetail_related",
        order: 0,
        component: RelatedInfo
    })


})