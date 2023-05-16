<template>
    <el-dialog 
    :model-value="modelValue"
    :before-close="handleCloseDialog"
    :close-on-click-modal="false"
    append-to-body>
  <template #title>
    {{ isEdit ? $t('dpDocument_acl_editLocal'): $t('dpDocument_acl_addLocal')}}
  </template>
  <el-form :model="aclForm" ref="FormRef" abel-position="top" @submit.native.prevent>
    <el-form-item
      :label="$t('user_username')"
      prop="userId"
      :rules="[{ required: true, message: $t('form_common_requird')}]"
    >
      <el-select v-model="aclForm.userId" :disabled="isEdit" filterable clearable>
        <el-option v-for="user in userList" :key="user.id" :label="user.userId" :value="user.userId" />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('dpTable_right')"
      prop="permission"
      :rules="[{ required: true, message: $t('form_common_requird')}]"
    >
      <el-select v-model="aclForm.permission" filterable clearable>
        <el-option v-for="p in permissionOption" :key="p.label" :label="p.label" :value="p.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('dpTable_time')"
      prop="isPermanent"
      :rules="[{ required: true, message: $t('form_common_requird')}]"
    >
      <el-radio-group v-model="aclForm.isPermanent">
        <el-radio :label="true">{{$t('dpTable_permanent')}}</el-radio>
        <el-radio :label="false">{{$t('dpTable_dateBase')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-show="!aclForm.isPermanent"
      :label="$t('dpTable_dateRange')"
      prop="dateRange"
      :rules="[{ required: !aclForm.isPermanent, message: $t('form_common_requird')}]"
    >
      <el-date-picker
        v-model="aclForm.dateRange"
        type="datetimerange"
        :range-separator="$t('dpTable_to')"
        :start-placeholder="$t('dpForm_el-date-picker')"
        :end-placeholder="$t('dpForm_el-date-picker')">
      </el-date-picker>
    </el-form-item>
    
    <el-button @click="handleSubmit">{{$t('common_submit')}}</el-button>
  </el-form>
</el-dialog>
</template>

<script lang="ts" setup>

const props = defineProps<{
    modelValue: boolean,
    doc: any,
    exitList: string[]
}>()
const emit = defineEmits(['input', 'handleUpdate', 'handleAdd', 'update:modelValue'])
const {userList, getUserList} = useUser();
const FormRef = ref<Form>()
    const isEdit = computed(() => {
      return !!props.detail
    })
    const aclForm = ref<any>({
      idOrPath: '',
      userId: '',
      permission: '',
      isPermanent: true,
      dateRange: []
    })
const permissionOption = ref([
      {label:'Read', value:"Read"},
      {label:"Edit", value:"ReadWrite"},
      {label:"Manage record", value:"ManageRecord"}, 
      {label:"Manage legit hold", value:"ManageLegalHold"}, 
      {label:"Manage everything", value:"Everything"}
    ])

const handleSubmit = () => {
      FormRef.value.validate((valid) => {
        if(valid) {
          const result = { ...aclForm.value }
          if (result.isPermanent) {
            delete result.startDate
            delete result.endDate
          } else {
            result.startDate = result.dateRange[0]
            result.endDate = result.dateRange[1]
          }
          emit('input', false)
          if(isEdit.value) {
            emit('handleUpdate', result)
          } else {
            emit('handleSubmit', result)
          }
          FormRef.value.resetFields()
        }
      })
    }
    const handleCloseDialog = (done) => {
      FormRef.value.resetFields()
      emit('update:modelValue', false)
      done()
    }

    useFetch( async() => await getUserList())
    watch(() => props.modelValue, (newValue: any) => {
      if (newValue && isEdit.value) {
      
        aclForm.value = {...props.detail, 
            isPermanent: !props.detail.startDate && !props.detail.endDate,
            dateRange: (props.detail.startDate && props.detail.endDate) ? [props.detail.startDate, props.detail.endDate] : null
            }
      } else {
        nextTick(() => {
          aclForm.value = {
            idOrPath: '',
            userId: '',
            permission: '',
            isPermanent: true,
            dateRange: [],
          }
          if(FormRef.value) {
              FormRef.value.resetFields()
          }
        })
      }
    })
</script>

<style lang="scss" scoped>
.el-select, .el-radio-group, .el-date-editor.el-input{
  width: 100%
}
::v-deep .el-dialog__body {
  padding: 0 20px 30px;
}
::v-deep .el-date-editor {
  width: 100%;
  .el-range-separator {
    width: 2rem;
  }
}
</style>