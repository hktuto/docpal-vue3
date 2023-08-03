<template>
<el-dialog 
    class="scroll-dialog"
    v-model="state.visible" :title="state.setting?.isEdit ? $t('folderCabinet.edit') : $t('folderCabinet.create')"
    :close-on-click-modal="false" append-to-body
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" @docTypeChange="handleDocTypeChange">
        <template v-slot:dragSelect>
            <el-form label-position="top" ref="FormRef" :model="form">
                <el-form-item prop="labelRule" class="intro"
                    :rules="[{ required: true, message: $t('form_common_requird')}]">
                    <template #label>
                        {{$t('tableHeader_labelRule')}}
                        <span class="color__primary__hover cursorPointer" @click="goMetaEdit">({{$t('tip.clickToEditDisplayMeta')}})</span>
                    </template>
                    <DragSelect :dragList="state.dragList" :dropList="form.labelRule"/>
                </el-form-item>
            </el-form>
        </template>
    </FromRenderer>
    <template #footer>
        <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, GetBreadcrumb, CreateCabinetTemplateApi, PatchCabinetTemplateApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: null,
    dragList: [],
    curDocType: '',
    editReady: false
})
const router = useRouter()
const form = reactive({
    labelRule: []
})
const FormRef = ref()
const FromRendererRef = ref()
const formJson = getJsonApi('admin/folderCabinet.json')
function handleDocTypeChange (data) {
    if (state.editReady) form.labelRule = []
    state.curDocType = data.value
    state.dragList = data.metaList.reduce((prev, item) => {
        if((item.dataType === 'string' || item.dataType === 'date') && item.isRequire) {
            prev.push({
                metaData: item.metaData,
                dataType: item.dataType
            })
        }
        return prev
    }, [])
    state.dragList.push(
        { metaData: 'fc:label', dataType: 'string' },
        { metaData: 'fc:createDate', dataType: 'date' },
        { metaData: 'fc:creator', dataType: 'string ' }
    )
    if (form.labelRule.length > 0) {
        state.dragList = state.dragList.filter((allItem:any) => 
              !form.labelRule.some((exitItem:any) => exitItem.metaData === allItem.metaData))
    }
}
async function handleSubmit() {
    const valid = FormRef.value.validate()
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    if(!valid || !data) return
    const params = {
        ...data,
        folder: true
    }
    params.labelRule = JSON.stringify(form.labelRule) 
    if(data.rootId && data.rootId.length > 0) params.rootId = data.rootId.pop()
    params.binds = data.binds.reduce((prev, item) => {
        const _bindItems = item.split('&&&&')
        prev.push({
            type: _bindItems[0],
            bindId: _bindItems[1]
        })
        return prev
    }, [])
    params.metadata = data.metadata.reduce((prev, item) => {
        const _metadataItems = item.split('&&&&')
        prev.push({
            type: _metadataItems[0],
            name: _metadataItems[1]
        })
        return prev
    }, [])
    
    // params.tos = data.tos.reduce((prev, item) => {
    //     const _to = item.split('&&&&')
    //     prev.push(_to[0])
    //     return prev
    // }, [])
    // params.ccs = data.ccs.reduce((prev, item) => {
    //     const _to = item.split('&&&&')
    //     prev.push(_to[0])
    //     return prev
    // }, [])
    try {
        state.loading = true
        if (params.isEdit) {
            params.id = state.setting.id
            await PatchCabinetTemplateApi(params)
        } else {
            await CreateCabinetTemplateApi(params)
        }
        FromRendererRef.value.vFormRenderRef.resetForm()
        state.visible = false
        emits('update')
    } catch (error) {
    }
    state.loading = false
}
function handleOpen(setting) {
    state.visible = true
    state.editReady = false
    if(setting && setting.isEdit) {
        state.setting = setting
        form.labelRule = setting.labelRule ? JSON.parse(setting.labelRule) : []
        setTimeout(async () => {
            await FromRendererRef.value.vFormRenderRef.resetForm()
            state.loading = true
            const data = {
                ...setting,
                metadata: revertMetadata(setting.metadata),
                isEdit: true,
                binds: revertUserGroup(setting.binds),
                rootId: await getRootIds(setting.rootId)
            }
            await FromRendererRef.value.vFormRenderRef.setFormData(data)
            state.loading = false
            setTimeout(() => { state.editReady = true },1000)
        })
    } else {
        state.editReady = true
        setTimeout(() => { FromRendererRef.value.vFormRenderRef.resetForm() })
    }
}
function goMetaEdit () {
    let r = '/meta'
    if (state.curDocType) r += `/${state.curDocType}`
    const url = router.resolve(r)
    window.open(url.href, '_blank');
}
async function getRootIds(idOrPath: string) {
    const data = await GetBreadcrumb(idOrPath)
    return data.map(item => (item.id))
}
function revertUserGroup (binds) {
    return binds.reduce((prev, item) => {
        prev.push(`${item.type}&&&&${item.bindId}`)
        return prev
    }, [])
}
function revertMetadata (binds) {
    return binds.reduce((prev, item) => {
        prev.push(`${item.type}&&&&${item.name}`)
        return prev
    }, [])
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
