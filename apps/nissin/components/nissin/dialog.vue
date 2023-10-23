<script lang="ts" setup>
import ImageCrop from './ImageCrop.vue';

const opened = ref(false)
        
onMounted(() => {
    setTimeout(() => {
        opened.value = true;
    }, 100)
})
</script>

<template>
    <el-dialog 
        v-model="opened"
        :append-to-body="true"
        :modal="true"
        width="640"
        custom-class="centerDialog"
        :close-on-click-modal="false"
        destroy-on-close
        @close="$emit('close')"
    >
        <ImageCrop />
    </el-dialog>
</template>

