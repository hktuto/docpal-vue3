<template>
   <div class="userGroup" v-show="doc.canContorl || aces.length > 0">
    <div class="userGroupTitle">
      <span class="title">{{ $t('rightDetail_userGroup') }}</span>
      <div class="icon">
        <img class="cursorPointer" :src="`/icons/add.svg`" v-show="doc.canContorl" @click="handleAdd"/>
        <!-- <img class="cursorPointer" src="/icons/fold.svg" /> -->
      </div>
    </div>
    <div class="userGroup--content">
      <el-tag  v-for="(ace, i) in aces" :key="i" :class="['userRightItem',{ cursorPointer: ace.type === 'local' && doc.canContorl }]" effect="dark"
            :closable="ace.type === 'local' && doc.canContorl" 
            @close="handleRemove(ace)"
            @click="handleEdit(ace)">
            {{ ace.userId }}: {{ ace.permission }}
      </el-tag>
    </div>
    <BrowseInfoAclEditDialog v-model="aclEditDialogShow" :detail="aclEditDetail" @handleSubmit="handleAddLocalAclSubmit" @handleUpdate="handleUpdateLocalAclSubmit"/>
  </div> 
</template>


<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { getUserAndRights , removeACLApi, addACLApi, replaceACLApi} from 'dp-api'
const props = defineProps<{doc: any}>();
const { doc } = toRefs(props);
const { t } = useI18n();

const aces = ref([])
const userId:string = useUser().getUserId()
async function handleDataGet () {
    aces.value = []
    const res = await getUserAndRights(props.doc.id)
    res.forEach(item => {
        item.aces.forEach(aceItem => {
            aceItem.type = item.name
            aces.value.push(aceItem)
            })
    })
    aces.value = aces.value.filter( a =>  (!a.id.includes('false')) && 
                                        a.userId !== userId )
}

// #region module: handle Edit
    const aclEditDialogShow = ref(false);
    const aclEditDetail = ref()

    async function handleRemove (ace) {
    const action = await ElMessageBox.confirm(`${i18n.t('msg_confirmWhetherToDelete')}`,{
        confirmButtonText: `${i18n.t('dpButtom_confirm')}`,
        cancelButtonText: `${i18n.t('dpButtom_cancel')}`
    }).catch((action) => { return action })
    if(action !== 'confirm') return
    await removeACLApi({ idOrPath: props.doc.id, userId: ace.userId })
    handleDataGet()
    }
    function handleEdit (ace) {
    if (ace.type !== 'local' || !props.doc.canContorl) return
    aclEditDetail.value = JSON.parse(JSON.stringify(ace))
    aclEditDialogShow.value = true
    }
    function handleAdd () {
    aclEditDetail.value = null
    aclEditDialogShow.value = true
    }
    async function handleAddLocalAclSubmit (_data:any) {
    _data.idOrPath = props.doc.id
    await addACLApi(_data)
    handleDataGet()
    }
    async function handleUpdateLocalAclSubmit(_data:any) {
    _data.idOrPath = props.doc.id
    _data.aceId = _data.id
    delete _data.isPermanent
    delete _data.id
    await replaceACLApi(_data)
    handleDataGet()
    }
// #endregion

watch(doc, async (val: String) => {
    if(val) {
    await handleDataGet()
    }
}, { immediate: true })



</script>



<style lang="scss" scoped>
.userGroup {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  // border-bottom: 1px solid var(--color-grey-200);
  .userGroupTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 1.125rem;
      line-height: 1.375rem;
      color: var(--color-grey-500);
    }
  }
  &--content {
    .el-tag {
      border-radius: 15px;
      margin: calc(var(--app-padding) / 3) calc(var(--app-padding) / 2);
    }
  }
}

</style>