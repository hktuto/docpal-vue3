<template>
    <el-dialog 
        :visible.sync="opened"
        :append-to-body="true"
        :modal="true"
        width="500"
        custom-class="centerDialog"
        :close-on-click-modal="false"
        destroy-on-close
        @close="$emit('close')"
    >
        <ImageCrop />
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import ImageCrop from './ImageCrop.vue';

export default defineComponent({
    components:{ImageCrop},
    setup(){
        const opened = ref(false)
        
        onMounted(() => {
            setTimeout(() => {
                opened.value = true;
            }, 100)
        })
        return {
            opened
        }
    }
})
</script>