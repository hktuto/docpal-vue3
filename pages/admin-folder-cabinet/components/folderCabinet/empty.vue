<template>
    <div class="emptyContainer">
        <div class="iconContainer">
            <SvgIcon class="svg"  :src="'/icons/menu/watermark.svg'"/>
            <h3>{{$t('folderCabinet.notFound')}}</h3>
        </div>
        <div class="formContainer">
            <FromRenderer ref="FromRendererRef" :form-json="formJson"/>
        </div>
        <el-button type="primary" :loading="state.loading" @click="submit">{{$t('folderCabinet.create')}}</el-button>
    </div>
</template>

<script lang="ts" setup>
import { getJsonApi, CreateCabinetTemplateApi } from 'dp-api'
const emit = defineEmits(['update'])
const router = useRouter()
const state = reactive({
    loading: false
})
// #region module: formJson
    const formJson = getJsonApi('admin/folderCabinet.json')
    const FromRendererRef = ref()
// #endregion
async function submit() {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    const params = {
        ...data,
        rootId: data.rootId.pop(),
        folder: true
    }
    params.binds = data.binds.reduce((prev, item) => {
        const _bindItems = item.split(':')
        prev.push({
            type: _bindItems[0],
            bindId: _bindItems[1]
        })
        return prev
    }, [])
    try {
        state.loading = true
        await CreateCabinetTemplateApi(params)
        emit('update')
    } catch (error) {
        
    }
    state.loading = false
}
</script>


<style lang="scss" scoped>
.emptyContainer{
    --max-width: 250px;
    height: 100%;
    width: var(--max-width);
    padding: calc(var(--max-width) / 3) 0;
    margin: 0 auto;
    gap: var(--app-padding);
    display: grid;
    grid-template-rows: min-content 1fr min-content;
}
.iconContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
    h3{
        font-size: 1.5rem;
        font-weight: 200;
        color: #8796A4;
        margin: 0;
        margin-bottom: 1rem;
    }
    .svg {
        --icon-size: calc(var(--max-width) / 2);
        // width: var(--max-width);
        color: #8796A4;
    }
}
.formContainer{
    width: 100%;
    overflow: auto;
    position: relative;
}
.el-button {
    width: 100%;
}
</style>
