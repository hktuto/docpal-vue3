<template>
    <div v-show="pictureViews.length > 0" class="PictureSection">
    <div class="infoTitle">
      <span class="title">{{ $t('rightDetail_pictureViews') }}</span>
    </div>
    <div class="overflowHidden">
      <el-table :data="pictureViews" size="small">
        <el-table-column fixed="left" prop="filename" :label="$t('filePopover_fileName')" ></el-table-column>
        <el-table-column prop="width*height" :label="$t('tableHeader_width*height')" align="center" :formatter="formatter"></el-table-column>
        <el-table-column prop="fileSize" :label="$t('tableHeader_fileSize')" align="center" :formatter="formatter"></el-table-column>
        <el-table-column prop="fileFormat" :label="$t('tableHeader_fileFormat')" align="center" :formatter="formatter"></el-table-column>
        <el-table-column fixed="right"   width="40" align="center" :formatter="formatter">
            <template #default="scope">
              <el-button type="text" :icon="Download" @click="handleDownload(scope.row, $event)"></el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { ElNotification, ElMessage } from 'element-plus'
import { Download, Loading } from '@element-plus/icons-vue'
import { DamDownloadApi, GetDamSettingsApi } from 'dp-api'
const props = defineProps<{doc: any}>();
const state = reactive({
  damSettings: {}
})
const { displayTime } = useTime()
const pictureViews = computed(() => {
    switch(props.doc.type) {
        case 'Picture' :
          if(!props.doc?.properties || !props.doc.properties['picture:views']) return [];
          return props.doc.properties['picture:views'].filter(item => item.tag === 'custom')
        case 'Video' :
          if(!props.doc.properties['vid:transcodedVideos'] || props.doc.properties['vid:transcodedVideos'].length === 0) return [];
          const list = props.doc.properties['vid:transcodedVideos'].reduce((prev, item) => {
            if(filterMimeType(item.info.format)) {
              prev.push({
                content: item.content,
                width: item.info.width,
                height: item.info.height,
                filename: item.content.name,
                format: item.info.format,
              })
            }
            return prev
          }, []);
          return list;
        default:
          return []
        }
})
function filterMimeType(format: string) {
  try {
    const _mimeType = props.doc?.properties['file:content']['mime-type'].split('/').pop()
    return state.damSettings[_mimeType].find(item => item.targetType === format)
  } catch (error) {
    return false    
  }
}
function formatter (row, column) {
      switch(column.property) {
        case "fileSize": 
          return fileSizeFilter(row.length || row.content.length)
        case 'width*height':
          return row.width && row.height ?`${row.width} x ${row.height}` : "NA"
        case 'fileFormat':
          return row.format || row.info.format
      }
    }

function fileSizeFilter (bytes) {
  bytes = Number(bytes)
  const units = ["B", "KB", "MB", "GB", "TB"]
  let unit = ''
  for (let i = 1; bytes / 1024 >= 1; i++) {
    unit = units[i]
    bytes = bytes / 1024
  }
  return bytes.toFixed(2) + unit
}
async function handleDownload (row) {
  const name = row.filename || row.content.name
  const noti = ElNotification({
    title: $i18n.t('download'),
    icon: Loading,
    dangerouslyUseHTMLString: true,
    message: `<div title="${name}">${name}</div>`,
    showClose: true,
    customClass: 'loading-notification',
    duration: 0,
    position: 'bottom-right'
  });
  try {
    const response = await DamDownloadApi(props.doc.id, row.content.data)
    downloadBlob(response, name)
  } catch (error) {
  }
  noti.close()
}
onMounted(async() => {
  state.damSettings = await GetDamSettingsApi()
})
</script>