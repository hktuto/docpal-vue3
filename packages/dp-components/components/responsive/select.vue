<template>
<div>
    <el-button ref="buttonRef" text v-click-outside="onClickOutside">
        {{$t(selectData.label)}}
        <el-tag v-if="selectData.value && selectData.value.length > 0" class="el-icon--right" effect="dark" round size="small">{{selectData.value.length > 9 ? '9+' : selectData.value.length}}</el-tag>
        <el-icon class="el-icon--right"><ArrowDownBold /></el-icon>
    </el-button>
    <el-popover
        ref="popoverRef"
        :virtual-ref="buttonRef"
        placement="bottom"
        :width="300"
        trigger="click"
        virtual-triggering
        :popper-append-to-body="false"
    >
        <template #default>
            <el-checkbox-group v-if="selectData.options && selectData.options.length > 0"
                v-model="selectData.value"
                @change="handleChange(selectData)">
                <el-checkbox v-for="item in selectData.options" :label="item.value" :key="item.value" >
                    <template v-if="selectData.type === 'date'">
                        {{formatDate(item.label)}}
                    </template>
                    <template v-else> {{item.label}} </template>
                </el-checkbox>
            </el-checkbox-group>
            <div v-else>
                {{$t('noData')}}
            </div>
        </template>
    </el-popover>
</div>
</template>

<script  lang="ts" setup>
import type ResSelectData from './filter.vue'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { deepCopy } from 'dp-api';
const props = defineProps<{
    selectData: ResSelectData,
}>();
const emits = defineEmits(['change'])
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
    console.log(popoverRef);
    
//   unref(popoverRef).popperRef?.delayHide?.()
}
function handleChange (data: ResSelectData) {
    emits('change', {
        fieldName: data.key,
        value: deepCopy(data.value)
    })
}
</script>
<style lang="scss" scoped>
.el-checkbox {
    width: 100%;
    white-space: pre-wrap;
}
</style>
