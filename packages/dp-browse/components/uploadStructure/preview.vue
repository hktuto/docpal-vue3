<template>
    <div class="previewContainer">
        <div v-if="!isSupport" class="noSupportContainer">no support</div>
        <div v-else-if="previewType === 'image'" class="imgContainer">
            <img  :src="state.url" frameborder="0" />
        </div>
        <video v-else-if="previewType === 'video'" :src="state.url" frameborder="0" width="100%" height="100%" />
        <iframe v-else-if="previewType === 'pdf'" :src="state.url" frameborder="0" width="100%" height="100%" />
        <div v-else-if="previewType === 'text'"  frameborder="0" width="100%" height="100%" >{{ state.url }}</div>
       
    </div>
</template>


<script lang="ts" setup>
const supportList:string[] = [];

const isSupport = ref(false)
const previewType = ref<"image" | "pdf" | "video" | "text">('image')
const state = reactive({
    url: "",
})


async function init(doc) {
    console.log(doc);
    if(doc.file) {
        const type = doc.file.type
        isSupport.value = true
        // check file type is image
        if(type.startsWith('image')) {
            previewType.value = 'image'
            state.url = URL.createObjectURL(doc.file)
            return
        }
        if(type.startsWith('video')) {
            previewType.value = 'video'
            state.url = URL.createObjectURL(doc.file)
            return
        }
        if(type.startsWith('text')) {
            previewType.value = 'text'
            state.url = await doc.file.text()
            console.log(state.url)
            return
        }
        if(type.startsWith('application/pdf')) {
            previewType.value = 'pdf'
            state.url = URL.createObjectURL(doc.file)
            return
        }
        isSupport.value = false
    }
    // state.doc = doc
    // const { documentType } = doc
    // const support = supportList.find(item => item.documentType === documentType)
    // if(support) {
    //     state.doc = support
    // }
}

defineExpose({
    init
})  
</script>


<style lang="scss" scoped>
.previewContainer{
    height: 100%;
    overflow: hidden;
    background: var(--color-grey-050);
    padding: var(--app-padding);
}
.imgContainer{
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
.noSupportContainer{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
