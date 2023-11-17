<template>
<el-dialog v-model="state.visible" :title="state.title"
    class="scroll-dialog"
    append-to-body 
    :close-on-click-modal="false"
    @close="handleClose"
    >
    <FromVariablesRenderer ref="FromVariablesRendererRef"/>
    <template #footer>
        <div class="footer-grid">
            <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
        </div>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, CreateMasterTablesRecordApi, UpdateMasterTablesRecordApi, deepCopy } from 'dp-api'
const props = withDefaults(defineProps<{
    ignoreList: string[],
}>(), {
  ignoreList: []
})
const emits = defineEmits([
    'refresh', 'delete'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
    fields: [],
    edit: false,
    title: $t('masterTable.newRow')
})
const route = useRoute()
const router = useRouter()
async function handleSubmit () {
    state.loading = true
    const data = await FromVariablesRendererRef.value.getData()
    console.log({data});
    
    try {
        if(state.edit) {
            await UpdateMasterTablesRecordApi({
                id: route.params.id,
                data: [data],
                where: {
                    id: state.setting.id
                }
            })
        }
        else {
            await CreateMasterTablesRecordApi({
                id: route.params.id,
                data: [data]
            })
        }
        state.visible = false
        emits('refresh')
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
function turnFields(fields) {
    const typeMap = {
        'varchar': 'input',
        'VARCHAR:255': 'textarea',
        'varchar:4000': 'textarea',
        'clob': 'textarea',
        'bigint': 'number',
        'timestamp': 'date',
        'bit': 'switch'
    }
    return fields.reduce((prev, item) => {
        if(!props.ignoreList.includes(item.columnName) && typeMap[item.dataType]) {
            const _item = {
                name: item.columnName,
                label: item.columnName,
                type: typeMap[item.dataType],
                required: item.required
            }
            if(item.dataType === 'varchar') _item.maxLength = 255
            else if(item.dataType === 'varchar:4000') _item.maxLength = 4000
            prev.push(_item)
        } 
        return prev
    }, [])
}
const FromVariablesRendererRef = ref()
function handleOpen(fields, row?) {
    state.visible = true
    state.loading = false
    state.fields = turnFields(fields, row)
    setTimeout(async () => {
        FromVariablesRendererRef.value.createJson(state.fields)
        if(row) {
            state.edit = true
            state.setting = row
            FromVariablesRendererRef.value.setData(row)
            state.title = $t('masterTable.editRow')
        }
        else {
            state.edit = false
            state.title = $t('masterTable.newRow')
            FromVariablesRendererRef.value.setData({})
        }
    })
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>

