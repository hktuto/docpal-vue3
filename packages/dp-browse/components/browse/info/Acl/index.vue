<template>
   <div class="infoSection" >
    <span class="infoTitle">{{ $t('rightDetail_userGroup') }}</span>
    <div class="infoContent">
      <div class="listSection">
        <div class="listTitle">{{ $t('permission.read') }}</div>
        <div class="listContent">
          <BrowseInfoAclItem v-for="(ace, i) in ReadList" :key="i" :ace="ace" :permission="permission" @handleEdit="handleEdit" @handleRemove="handleRemove"></BrowseInfoAclItem>
          <SvgIcon :src="'/icons/add.svg'" v-show="AllowTo({feature:'ManageRecord', userPermission: permission.permission})" @click="handleAdd('Read')"/>
        </div>
      </div>

      <div class="listSection">
        <div class="listTitle">{{ $t('permission.write') }}</div>
        <div class="listContent">
          <BrowseInfoAclItem v-for="(ace, i) in ReadWriteList" :key="i" :ace="ace" :permission="permission" @handleEdit="handleEdit" @handleRemove="handleRemove"></BrowseInfoAclItem>
          <SvgIcon :src="'/icons/add.svg'" v-show="AllowTo({feature:'ManageRecord', userPermission: permission.permission})" @click="handleAdd('ReadWrite')"/>
        </div>
      </div>

      <div class="listSection">
        <div class="listTitle">{{ $t('permission.manage') }}</div>
        <div class="listContent">
          <BrowseInfoAclItem v-for="(ace, i) in ManageRecordList" :key="i" :ace="ace" :permission="permission" @handleEdit="handleEdit" @handleRemove="handleRemove"></BrowseInfoAclItem>
          <SvgIcon :src="'/icons/add.svg'" v-show="AllowTo({feature:'ManageRecord', userPermission: permission.permission})" @click="handleAdd('ManageRecord')"/>
        </div>
      </div>

      <div class="listSection">
        <div class="listTitle">{{ $t('permission.everything') }}</div>
        <div class="listContent">
          <BrowseInfoAclItem v-for="(ace, i) in EverythingList" :key="i" :ace="ace" :permission="permission" @handleEdit="handleEdit" @handleRemove="handleRemove"></BrowseInfoAclItem>
          <SvgIcon :src="'/icons/add.svg'" v-show="AllowTo({feature:'ManageRecord', userPermission: permission.permission})" @click="handleAdd('Everything')"/>
        </div>
      </div>
      
      
    </div>
    <BrowseInfoAclEditDialog ref="dialogEl" v-model="aclEditDialogShow" :detail="aclEditDetail" @handleSubmit="handleAddLocalAclSubmit" @handleUpdate="handleUpdateLocalAclSubmit"/>
  </div> 
</template>


<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { getUserAndRights , removeACLApi, addACLApi, replaceACLApi} from 'dp-api'
const props = defineProps<{doc: any, permission: any}>();
const { doc, permission } = toRefs(props);
const { t } = useI18n();

const aces = ref([])
const userId:string = useUser().getUserId()
const dialogEl = ref();

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

const ReadList = computed(() => {
    return aces.value.filter(ace => ace.permission === 'Read')
})
const ReadWriteList = computed(() => {
    return aces.value.filter(ace => ace.permission === 'ReadWrite')
})
const ManageRecordList = computed(() => {
    return aces.value.filter(ace => ace.permission === 'ManageRecord')
})
const EverythingList = computed(() => {
    return aces.value.filter(ace => ace.permission === 'Everything')
})

// #region module: handle Edit
    const aclEditDialogShow = ref(false);
    const aclEditDetail = ref()

    async function handleRemove (ace) {
      const action = await ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`,{
          confirmButtonText: `${t('dpButtom_confirm')}`,
          cancelButtonText: `${t('dpButtom_cancel')}`
      }).catch((action) => { return action })
      if(action !== 'confirm') return
      await removeACLApi({ idOrPath: props.doc.id, userId: ace.userId })
      handleDataGet()
    }
    function handleEdit (ace) {
      
      if (ace.type !== 'local' ||!AllowTo({feature:'ManageRecord', userPermission: props.permission.permission})) return
      aclEditDetail.value = JSON.parse(JSON.stringify(ace))
      dialogEl.value.isEdit = true
      aclEditDialogShow.value = true
    }
    function handleAdd (type?:string) {
      aclEditDetail.value = {
        permission: type,
      }
      dialogEl.value.isEdit = false
      aclEditDialogShow.value = true
    }
    async function handleAddLocalAclSubmit (_data:any) {
      _data.idOrPath = props.doc.id
      await addACLApi(_data)
      handleDataGet()
      aclEditDialogShow.value = false
    }
    async function handleUpdateLocalAclSubmit(_data:any) {
      _data.idOrPath = props.doc.id
      _data.aceId = _data.id
      delete _data.isPermanent
      delete _data.id
      await replaceACLApi(_data)
      handleDataGet()
      aclEditDialogShow.value = false
    }
// #endregion



watch(doc, async (val: String) => {
    if(val) {
    await handleDataGet()
    }
}, { immediate: true })



</script>



<style lang="scss" scoped>
.listTitle{
  font-size: .8rem;
  margin-block: 6px;
}
.listSection{
  width: 100%;
  margin-bottom: 6px;
  + & {
    border-top: 1px solid var(--color-grey-100);
  }
}

.infoContent, .listContent{
  display: flex !important;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
}
</style>