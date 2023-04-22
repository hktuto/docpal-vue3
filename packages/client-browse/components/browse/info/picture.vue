<template>
    <div v-show="pictureViews.length > 0" class="PictureSection">
    <div class="infoTitle">
      <span class="title">{{ $t('rightDetail_pictureViews') }}</span>
    </div>
    <div class="overflowHidden">
      <el-table :data="pictureViews" height="100%">
        <el-table-column prop="filename" :label="$t('filePopover_fileName')" sortable></el-table-column>
        <el-table-column prop="width*height" :label="$t('tableHeader_width*height')" align="center" :formatter="formatter"></el-table-column>
        <el-table-column prop="fileSize" :label="$t('tableHeader_fileSize')" align="center" :formatter="formatter"></el-table-column>
        <el-table-column prop="fileFormat" :label="$t('tableHeader_fileFormat')" align="center" :formatter="formatter"></el-table-column>
        <el-table-column :label="$t('tableHeader_actions')" width="80" align="center" :formatter="formatter">
            <template slot-scope="scope">
              <Button type="text" icon="el-icon-download" @click="handleDownload(scope.row, $event)"></Button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{doc: any}>();

const { displayTime } = useTime()
const pictureViews = computed(() => {
    if (props.doc?.properties && props.doc.properties['picture:views']) {
    return props.doc.properties['picture:views'].filter(item => item.tag === 'custom')
    }
    return []
})

function formatter (row, column) {
      switch(column.property) {
        case "fileSize": 
          return fileSizeFilter(row.content.length)
        case 'width*height':
          return `${row.width} x ${row.height}`
        case 'fileFormat':
          return row.info.format
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
    function handleDownload (row) {
        // TODO : download file
      const { externalEndpoint } = useSetting();
      let origin = externalEndpoint?.value?.docpal
      origin = origin.includes('http') ? origin : 'https://' + origin
      const a = row.content.data
      const url = a.replace(/(http(s)?:\/\/).*?(?=\/)/, origin)
      downloadUrl(url, row.filename)
    }
</script>