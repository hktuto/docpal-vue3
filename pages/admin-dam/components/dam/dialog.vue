<template>
<el-dialog v-model="state.visible" 
    :close-on-click-modal="false"
    >
    <template #title>
        {{$t(`DAM_${state.title}`)}}
        <span v-if="state.title !== 'addNewDAM'"> - {{state.data.sourceType}}</span>
        <span v-if="state.title === 'editNewConvertion'"> - {{state.data.label}}</span>
    </template>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit()">{{$t('common_submit')}}</el-button>
    </template>
    <el-form label-position="top" ref="FormRef" :model="state.data" @submit.native.prevent>
        <template v-if="state.title === 'addNewDAM'">
            <el-form-item :label="$t('DAM_fileType')"
                        prop="sourceType"
                        :rules="[{ required: true, message: $t('form_common_requird')}]"
            >
                <el-select v-model="state.data.sourceType" filterable clearable @change="handleSourceTypeChange">
                    <el-option v-for="(item, index) in state.typeList" :key="index" :label="item.name" :value="item.name" />
                </el-select>
            </el-form-item>
            <div class="title">{{$t('DAM_convertion')}}</div>
        </template>
        <el-form-item :label="$t('tableHeader_label')"
              prop="label"
              :rules="[{ required: true, message: $t('form_common_requird')}]"
        >
            <el-input type="text" v-model="state.data.label" />
        </el-form-item>
        <el-form-item prop="name" v-show="false">
            <el-input type="text" v-model="state.data.name" />
        </el-form-item>
        <el-form-item :label="$t('DAM_targetFormat')"
              prop="targetType"
              :rules="[{ required: true, message: $t('form_common_requird')}]"
        >
            <el-select v-model="state.data.targetType" filterable clearable @change="handleTargetTypeChange">
                <el-option v-for="(item, index) in state.targetList" :key="index" :label="item.targetFileType" :value="item.targetFileType" />
            </el-select>
        </el-form-item>
        <template v-if="Object.keys(state.data.operation).includes('action')">
            <div class="title">{{$t('DAM_operation')}}</div>
            <el-form-item :label="$t('tableHeader_actions')" prop="operation.action">
                <el-select v-model="state.data.operation.action" filterable clearable @change="handleActionChange">
                    <el-option :label="$t('zoom')" value="zoom" />
                    <el-option :label="$t('compress')" value="compress" />
                    <el-option :label="$t('rotate')" value="rotate" />
                </el-select>
            </el-form-item>
            <template v-if="state.data.operation.action === 'zoom'">
                <el-form-item :label="$t('height')" prop="operation.height"
                        :rules="[ 
                            { required: true, message: $t('form_common_requird'), trigger: 'blur' },
                            { validator: numberValidate, trigger: 'blur'}
                        ]"
                >
                    <el-input v-model="state.data.operation.height" type="text" />
                </el-form-item>
                <el-form-item :label="$t('width')"
                        prop="operation.width"
                        :rules="[ 
                            { required: true, message: $t('form_common_requird'), trigger: 'blur' },
                            { validator: numberValidate, trigger: 'blur'}
                        ]"
                >
                    <el-input v-model="state.data.operation.width" type="text" />
                </el-form-item>
            </template>
            <template v-else-if="state.data.operation.action">
                <el-form-item :label="$t('dub')"
                        prop="operation.dub"
                        :rules="[ 
                            { required: true, message: $t('form_common_requird'), trigger: 'blur' },
                            { validator: dubValidate, trigger: 'blur'}
                        ]"
                >
                    <template #label>{{$t('dub')}}
                        <el-tooltip placement="top-start" effect="light">
                            <template #content>
                                <a v-if="state.data.operation.action === 'rotate'" href="https://imagemagick.org/script/command-line-options.php#rotate" target="_blank">
                                    {{$t('dpTip.jumpToView')}}
                                </a>
                                <a v-else href="https://imagemagick.org/script/command-line-options.php#quality" target="_blank">
                                    {{$t('dpTip.jumpToView')}}
                                </a>
                            </template>
                            <el-icon class="cursorPointer"><InfoFilled /></el-icon>
                        </el-tooltip>
                    </template>
                    <el-input v-model="state.data.operation.dub" type="text" />
                </el-form-item>
        </template>
        </template>
    </el-form>
</el-dialog>
</template>
<script lang="ts" setup>
import { InfoFilled } from '@element-plus/icons-vue';
import { 
    AddDamApi,
    deepCopy,
    EditDamApi,
    GetDamSupportedFormat, 
} from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    title: '',
    data: {
        operation: {}
    },
    typeList: [],
    targetList: []
})
const FormRef = ref()
async function handleSubmit () {
    const data = await getFormData()
    data.operation = JSON.stringify(data.operation)
    switch (state.title) {
        case 'addNewDAM':
        case 'addNewConvertion':
            await AddDamApi(data)
            break;
        case 'editNewConvertion':
            await EditDamApi(data)
    }
    emits('refresh')
    state.loading = false
    state.visible = false
}
async function getFormData () {
    const valid = await FormRef.value.validate((valid, fields) => {
        return valid
    })
    if (!valid) return false
    else return deepCopy(state.data)
}
function handleOpen(data) {
    state.visible = true
    if(data.rowIndex || data.rowIndex === 0) {
        state.title = 'addNewConvertion'
        state.data = data
        state.data.operation = {}
        handleSourceTypeChange(state.data.sourceType)
    } else if(data.targetType) {
        state.title = 'editNewConvertion'
        state.data = data
        editSourceTypeChange(state.data.sourceType)
    } else {
        state.title = 'addNewDAM'
        state.data = {
            operation: {}
        }
    }
    setTimeout(() => {
        FormRef.value.clearValidate()
    })
}
const handleTargetTypeChange = (value) => {
    const targetItem = state.targetList.find(item => item.targetFileType === value)
    if(targetItem) {
        state.data.operation = { ...targetItem.operation }
        state.data.name = targetItem.name
    } else {
        state.data.operation = {}
        state.data.name = ''
    }
}
function handleActionChange (clearAction: boolean = true) {
    if(!clearAction) return
    state.data.operation.width = ''
    state.data.operation.height = ''
    state.data.operation.dub = ''
}
const handleTypeListGet = async() => {
    state.typeList = []
    const res = await GetDamSupportedFormat()
    if(!res) return
    Object.keys(res).forEach(key => {
        state.typeList.push({name: key, targetList: res[key]})
    })
}
const handleSourceTypeChange = async(value, clearTargetType:boolean = true) => {
    const item = state.typeList.find(item => item.name === value)
    state.targetList = item.targetList
    if(clearTargetType) state.data.targetType = ''
    handleTargetTypeChange()
    handleActionChange()
}
const editSourceTypeChange = async(value) => {
    const item = state.typeList.find(item => item.name === value)
    state.targetList = item.targetList
}
// #region module: validate 
    function numberValidate (_rule, value, callback) {
        if (value === '') {
            callback(new Error($i18n.t('form_common_requird') as string));
        } else if (!/^[1-9]\d*$/.test(value)){
            callback(new Error($i18n.t('dpTip.enterNumber') as string));
        } else {
            callback();
        }
    }
    function dubValidate (_rule, value, callback) {
        if (value === '') {
            callback(new Error($i18n.t('form_common_requird') as string));
        } else if (formData.value.operation.action === 'rotate' && 
            !/^-?\d+([<>])?$/.test(value)){
            callback(new Error($i18n.t('dpTip.formatError') as string));
        } else if (formData.value.operation.action === 'compress' && 
            !/^[1-9]\d*$/.test(value)){
            callback(new Error($i18n.t('dpTip.enterNumber') as string));
        }else {
            callback();
        }
    }
// #endregion
onMounted(async() => {
    await handleTypeListGet()
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
.el-select, .el-radio-group, .el-date-editor.el-input{
    width: 100%
}
.title {
    color: var(--color-grey-950);
    font-size: 1.2rem;
}
</style>
