<template>
     <div class="actionIconContainer">
        
        <el-popover placement="bottom" :width="260" trigger="click" >
            <template #reference>
                <div class="clickCon" >
                    <el-tooltip content="download" >
                        <el-icon >
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64zm384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64v450.304z"></path></svg>
                        </el-icon>
                    </el-tooltip>
                </div>
            </template>
            <div class="popoverContent">
                <!-- download button -->
                <el-button type="text" @click="downloadHandler">Download original</el-button>
                <!-- download as pdf button -->
                <el-button type="text" @click="downloadAsPdfHandler">Download as PDF</el-button>
                <!-- download pdf and annotation -->
                <el-button type="text" @click="downloadPdfAndAnnotationHandler">Download PDF with annotation</el-button>
            </div>
        </el-popover>
        
    </div>
</template>

<script lang="ts" setup>
const dialogOpened = ref(false)

const props = defineProps<{
    doc: any,
    selected: any[]
}>()
const visible = ref(false)
function iconClickHandler(){
    console.log('iconClickHandler');
    visible.value = true
    // open upload dialog
}
function downloadHandler(){
    console.log('downloadHandler')
}
function downloadAsPdfHandler(){
    console.log('downloadAsPdfHandler')
}

function downloadPdfAndAnnotationHandler(){
    console.log('downloadPdfAndAnnotationHandler')
}
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