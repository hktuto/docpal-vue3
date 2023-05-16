<template>
    <div class="updateFileInfoButtom__container">
    <SvgIcon :src="'/icons/left_edit.svg'"  :svg-class="`dp-svg-icon`"
                class="cursorPointer headerIcons"
                @click.native="handleDialogShow"/>
    <el-dialog 
      v-model="opened" 
      :append-to-body="true" 
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      custom-class="centerDialog">
      <div slot="title" class="title">{{ $t('file_updateDocument') }}</div>
      <el-form :model="formData" ref="FormRef" abel-position="top" v-loading="loading" @submit.native.prevent>
        <el-form-item :label="$t('tableHeader_name')"
                  prop="name"
                  :rules="[{ required: true, message: $t('form_common_requird')}]"
        >
          <el-input type="text" v-model="formData.name" />
        </el-form-item>
        <div v-for="(item,index) in formData.metaList" :key="index">
            <el-form-item 
                    v-if="item.display"
                    :prop="`metaList.${index}.value`"
                    :label="$t(item.metaData)"
                    :rules="[{ required: item.isRequire, message: $t('form_common_requird')}]"
            >
              <template v-if="item.dataType === 'date'">
                 <el-date-picker  v-model="item.value"
                              type="datetime"
                              :placeholder="$t('dpTip_datePicker')"
                              default-time="12:00:00"
                              value-format="yyyy-MM-ddTHH:mm:ss.000Z"></el-date-picker>
              </template>
              <template v-else-if="item.directoryEntries">
                 <el-cascader  v-model="item.value"
                            :options="item.directoryEntries" 
                            :props="{ checkStrictly: item.hasChild, value: 'id', label: 'id' }"
                            clearable filterable popper-class="pc-el-cascader"></el-cascader>
              </template>
              <template v-else>
                <el-input  v-model="item.value" type="text"  
                        :maxlength="item.length" show-word-limit/>
              </template>
            </el-form-item>
        </div>
      </el-form>
      <template #footer>
      <el-button  type="primary" @click="submitUpdate">{{
        $t('common_submit')
      }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { patchDocumentApi } from 'dp-api';
const props = defineProps<{doc:any}>();

const emits = defineEmits(['updated']);
const { t} = useI18n();

const loading = ref(false)
const opened = ref(false)
const formData = ref({
    name: '',
    metaList: []
})
const FormRef = ref()

const submitUpdate =  () => {
      FormRef.value.validate(async(valid) => {
        if(valid) {
          if(await checkDuplicate({...props.doc, name: formData.value.name})) return
          patchDocumentSubmit()
        }
      })
    }

async function patchDocumentSubmit (name) {
    const properties = {}
    formData.value.metaList.forEach(item => {
        if (item.directoryEntries && !item.isArray) properties[item.metaData] = item.value.join(',')
        else if (item.value) properties[item.metaData] = item.value
    })
    const param = {
        idOrPath: props.doc.path,
        name: name || formData.value.name,
        properties
    }
    await patchDocumentApi(param)
    emit('updated')
    handleUpdate('edit')
    opened.value = false
}
function handleUpdate (handleType) {
    const ev = new CustomEvent('tree-node-update', {
    detail: { doc: props.doc, handleType },
    })
    window.dispatchEvent(ev)
}
function handleDialogShow () {
    opened.value = true
    initForm()
}
// #region module:checkDuplicate
async function checkDuplicate (doc) {
    if(props.doc.name === doc.name) return false
    const { list, isDuplicate } = await duplicateNameFilter(doc.parentPath, [doc])
    if (isDuplicate) handleDuplicate(list[0])
    return isDuplicate
    }
    async function handleDuplicate (doc) {
    const action = await MessageBox.confirm(`${i18n.t('dpTip_duplicateFileName')}`,{
        confirmButtonText: `${i18n.t('dpButtom_keepFile')}`,
        cancelButtonText: `${i18n.t('dpButtom_cancel')}`
    }).catch((action) => { return action })
    if (action === 'confirm') {
        if(doc.isDuplicate) patchDocumentSubmit(await getUniqueName(doc))
    }
}
// #endregion
// #region module: initForm
function initForm () {
    if (!props.doc?.displayMeta) return
    const formValue = {}
    formValue.name = props.doc.name
    loading.value = true
    const res = [ ...props.doc.displayMeta ]
    res.forEach(item => {
        if (!item.display) return
        if (item.directoryEntries) {
        item.directoryEntries = handleChildOptions(item.directoryEntries)
        item.isArray = Array.isArray(props.doc.properties[item.metaData])
        item.value =  item.isArray ? 
                        props.doc.properties[item.metaData] :
                        props.doc.properties[item.metaData] ? props.doc.properties[item.metaData].split(',') : []
        }
        else item.value = props.doc.properties[item.metaData] ? props.doc.properties[item.metaData] : ''
    })
    formValue.metaList = res
    loading.value = false
    formData.value = { ...formValue }
    }
function handleChildOptions (list = []) {
    const result = []
    const keyNodes = {}

    const nodeList = list.map(node => {
        const clone = { ...node }
        keyNodes[clone.id] = clone;
        return clone;
    })
    nodeList.forEach(node => {
        const parentItem = keyNodes[node.properties.parent];
        if (parentItem) {
        parentItem.hasChild = true
        if(!parentItem.children) parentItem.children = []
        parentItem.children.push(node)
        }
        else result.push(node)
    })
    return result
}
</script>



<style lang="scss" scoped>
.updateFileInfoButtom__container {
  display: inline-block;
}
::v-deep .centerDialog {
  width: 500px;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  max-height: 80vh;
  .el-dialog__body {
    overflow: auto;
    padding: 5px 20px 30px;
  }
}

.el-cascader, .el-date-editor.el-input {
  width: 100%;
}

</style>
<style lang="scss">
.pc-cascader .el-cascader-node label{
  margin: unset;
} 
</style>
