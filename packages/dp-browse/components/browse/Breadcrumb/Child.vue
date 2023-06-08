<template>
    <div class="childContainer">
        <!-- TODO : display tree  -->
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{doc : true}>()
const loading = ref(false);

async function getChild() {
    const param = {
        idOrPath: props.doc.path,
        pageNumber: 0,
        isFolder: true
    }
    const {entryList} = await GetChildThumbnail(param)
}
</script>