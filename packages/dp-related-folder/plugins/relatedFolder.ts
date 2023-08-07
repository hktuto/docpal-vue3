import RelatedInfo from '~/components/related/info.vue'
// import RelatedMap from '~/components/related/map.vue'


export default defineNuxtPlugin(nuxtApp => {
    const { infoSlots } = useBrowse()

    infoSlots.value.push({
        name: "rightDetail_related",
        order: 0,
        component: RelatedInfo
    })



})