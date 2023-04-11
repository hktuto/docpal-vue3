<template>
    
        <el-popover placement="bottom" :width="260" trigger="click" >
        <template #reference>
            <div class="actionIconContainer">
            <div class="clickCon" >
                <el-tooltip content="edit">
                    <el-icon >
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path d="m199.04 672.64 193.984 112 224-387.968-193.92-112-224 388.032zm-23.872 60.16 32.896 148.288 144.896-45.696L175.168 732.8zM455.04 229.248l193.92 112 56.704-98.112-193.984-112-56.64 98.112zM104.32 708.8l384-665.024 304.768 175.936L409.152 884.8h.064l-248.448 78.336L104.32 708.8zm384 254.272v-64h448v64h-448z" fill="currentColor"></path></svg>
                    </el-icon>
                </el-tooltip>
            </div>
            </div>
        </template>
        <div class="popoverContent">
            <!-- input to change file name -->
            <el-input v-model="filename" type="textarea" placeholder="Enter new name" />
            
            <div class="buttonsContainer">
                <el-button type="text" @click="filename = doc.name">Reset</el-button>
                <el-button type="text" @click="submitFileChange">Submit</el-button>
            </div>
        </div>
        </el-popover>
</template>

<script lang="ts" setup>

const props = defineProps<{
    doc: any
}>()
const {doc} = toRefs(props)
const filename = ref(props.doc.name);

function submitFileChange(){
    console.log('submitFileChange')
}

watch(doc,(newDoc) => {
    filename.value = newDoc.name
},{immediate: true})
</script>


<style lang="scss" scoped>
.clickCon{
    width:1em;
    height: 1em;
}
.popoverContent{
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--app-padding);
    > button{
        width: 100%;
        text-align: left;
    }
}
</style>