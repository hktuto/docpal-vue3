<template>
    <div>
        <SvgIcon src="/icons/menu/collection.svg"  
            :content="$t('tip.addToCollection')"
            round
            @click="handleClick(doc)"></SvgIcon>
        <el-dialog class="scroll-dialog" v-model="state.dialogOpened" append-to-body 
                    :close-on-click-modal="false">
            <template #title>
                <strong class="primaryTitle">{{ $t('tip.addToCollection') }}</strong>
            </template>
            <FromRenderer ref="FromRendererRef" :form-json="formJson" @handleSubmit="handleSubmit"/>
        </el-dialog>
    </div>
    
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useEventListener } from '@vueuse/core'
import { addCollectionApi, createCollectionApi,getCollection, getJsonApi } from 'dp-api'
const props = defineProps<{
    selectedList: any,
    doc: any,
}>()
const emits = defineEmits(['clearSelected'])
const state = reactive({
    loading: false,
    dialogOpened: false
})
const FromRendererRef = ref()
const formJson = getJsonApi('client/addToCollection.json')

function handleClick(doc:any){
    state.dialogOpened = true
    setTimeout(() => {
        initData()
    })
}
function initData() {
    const buttonRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('submit')
    buttonRef.setDisabled(false)
}
async function handleSubmit(collection) {
    try {
        const param = {
            documents: props.selectedList.map(item => ({ idOrPath: item.id })),
            collection
        }
        await addCollectionApi(param)
        state.dialogOpened = false
        ElMessage.success($t('dpMsg_success'))
        emits('clearSelected')
    } catch (error) {
    }
    initData()
}
onMounted(() => {
})
</script>