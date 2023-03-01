<template>
<el-form-item :label="label" :prop="prop">
    <template v-if="type === 'select'">
        <el-select v-model="_modelValue" v-bind="_fieldOptions" @change="changeModelValue">
            <el-option
                v-for="item in _fieldOptions.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
    </el-select>
    </template>
    <template v-else>
        <el-input v-model="_modelValue" v-bind="_fieldOptions" @change="changeModelValue"/>
    </template>
</el-form-item>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
interface CascaderProp {
    checkStrictly: Boolean,
    value?: String,
    label?: String,
}
interface FormItemOptions {
}
interface FieldOptions {
    type?: String,
    placeholder?: String,
    defaultTime?: String,
    valueFormat?: String,
    clearable?:Boolean,
    filterable?:Boolean,
    props?: CascaderProp,
    popperClass?: String,
    options?: any
}
interface FormItemProps {
    type?: String, // field类型
    modelValue: any,
    prop: String,
    label: String,
    formItemOptions?: FormItemOptions,
    fieldOptions?: FieldOptions
}
const props = defineProps<FormItemProps>()
const _formItemOptions = computed<FormItemOptions>(() => {
    const option = {
    }
    return Object.assign(option, props?.formItemOptions)
})
const _fieldOptions = computed<FieldOptions>(() => {
    const option = {
        placeholder: '请填写'
    }
    return Object.assign(option, props?.fieldOptions)
})
const emit = defineEmits(['update:modelValue', 'change'])
const _modelValue = ref(props.modelValue)
const changeModelValue = (value) => {
    emit('update:modelValue', value)
    emit('change', value)
}
</script>
