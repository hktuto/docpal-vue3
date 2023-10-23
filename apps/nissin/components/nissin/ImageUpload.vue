<script lang="ts" setup>
    import { ElMessage } from 'element-plus';

    const emit = defineEmits(['imageChange'])
    
    const image = ref();
    const dragging = ref(false);
    const fields = ref([])

    function dropHandeler(ev:any) {
        ev.preventDefault()
        ev.stopPropagation()
    }

    function dropleave(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        // check file exisit
        if(ev.dataTransfer && ev.dataTransfer.files) {
            if(ev.dataTransfer.files.length > 1) {
                // more than 1 file,
                // show error
                ElMessage.error('only one file')
                return;
            }
            if(ev.dataTransfer && ev.dataTransfer.files[0]) {
                selectedFile(ev.dataTransfer.files[0])
            }
        }
    }

    function fileInputChagne(ev){
        ev.preventDefault()
        ev.stopPropagation()
        const file = ev?.target?.files[0]
        if(file) {
            selectedFile(file);
        }
    }

    function selectedFile(file){
        const { type } = file;
        console.log(type);
        if( type.includes('image') || type.includes('pdf')) {
            emit('imageChange', file);
        }
        
    }
</script>


<template>
     <div v-if="!image" 
        :class="{uploaderContainer:true, dragging}" 
        @mouseenter="dragging = true"
        @mouseleave="draggin = false"
        @dragenter="dropHandeler"
        @dragleave="dropleave"
        @dragover="dropHandeler"
        @drop="dropleave"
    >
        <label for="inputFile">Click or drop file here</label>
        <input id="inputFile" type="file" ref="fileUploadButtion" hidden @change="fileInputChagne"/>
    </div>
</template>





<style lang="scss" scoped>

.uploaderContainer{
    width: 100%;
    height: 100%;
    background: var(--color-grey-100);
    display: grid;
    place-items:center;
    broder-radius: 8px;
    overflow: hidden;
    &.dragging{
        border: 2px dash var(--color-grey-200);
    }
}
</style>

