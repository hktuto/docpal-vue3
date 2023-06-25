<template>
    <div class="popContainer">
    <div v-if="version === '0.0' || version === '0.0+'" class="noVersionContainer">
        {{version}}
    </div>
  <el-popover v-else ref="PopoverRef" width="300px" trigger="click" placement="bottom" popper-class="popover__version" >
    <div style="overflow: auto;">
      <el-table
        ref="TableRef"
        :data="tableData"
        height="250px"
        rowKey="version">
            <el-table-column prop="version" :label="$t('file_versionNumber')">
            </el-table-column>
            <el-table-column prop="time" :label="$t('table_lastModified')">
            </el-table-column>
          <el-table-column :label="$t('tableHeader_actions')" align="center" width="70">
            <template #default="scope">
              <img v-if="scope.row.version !== version" class="cursorPointer" :src="'/icons/version.svg'" round @click="toVersionComparison(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
    </div>
    <div style="text-align: right;">
      <CreateVersionButtom v-show="doc.isCheckedOut" :doc="doc" />
    </div>
    <template #reference>
      <div id="popover__reference" :class="['cursorPointer', { 'active': popoverShow }]" @click.stop="handlePopoverShow">
          {{ version }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
    </template>
  </el-popover>
</div>
</template>

<script lang="ts" setup>
import { getVersionsApi, TABLE , defaultTableSetting} from 'dp-api'
const props = defineProps<{
    doc: any
}>()
const { doc } = toRefs(props)
const router = useRouter();
const PopoverRef = ref()
const popoverShow = ref(false)
const { displayTime } = useTime()

const version = computed(() => {
    const major_version = props.doc?.properties?.['uid:major_version'] || 0
    const minor_version = props.doc?.properties?.['uid:minor_version'] || 0
    const plus = props.doc.isCheckedOut ? '+' : ''
    return major_version + '.' + minor_version + plus
})

const tableKey = TABLE.VERSION_POPOVER
const tableSetting = defaultTableSetting[tableKey]
const settingStore = useSetting()
const data = ref();
const TableRef = ref() 
const tableData = ref([])
const options = ref({
    showPagination:false,
})
function handlePopoverShow () {
      popoverShow.value = !popoverShow.value
    }
function handlerRowClick (_row:any, _column:any, _event:any) {
    }
function toVersionComparison (row:any) {
    // close detail
    const ev = new CustomEvent('close-file-detail');
    window.dispatchEvent(ev);
    const path = `/versionComparison/${props.doc.id}`
    router.push({
        path,
        query:{
            oldVersion: row.version
        }
    })
    

}
function hidePopover () {
    // let box = document.getElementById("popover__version")
    // if(!box.contains(e.target)){
    popoverShow.value = false
    // }
}

async function getList() {
    const res = await getVersionsApi({"idOrPath": props.doc.id})
     const result = []
    Object.keys(res).forEach(key => {
        result.push({ version: key, time: displayTime(res[key]) })
    });
    result.sort((a,b) => (b.version - a.version))
    tableData.value = result
}

watch(doc, (newValue) => {
    if (!props.doc.isFolder) (
        getList()
    )
    if(popoverShow.value) {
        PopoverRef.value.doClose()
    }
}, {deep: true, immediate: true})

onMounted(() => {
    document.addEventListener('click', hidePopover)
})
onUnmounted(() => {
    document.removeEventListener('click', hidePopover)
})
</script>