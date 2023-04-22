<template>
    <el-popover
        v-model="popoverShow"
        width="300"
        trigger="click"
        popper-class="collectionPopover popover_050"
    >
        <template #reference>
            <img  class="cursorPointer" src="icons/add.svg" />
        </template>

        <!-- 内容 -->
        <div class="title">{{ $t('tags_add') }}</div>
        <el-autocomplete
        v-model="tagSelected"
        :fetch-suggestions="querySearchAsync"
        :placeholder="$t('tip.input')"
        ></el-autocomplete>
        
        <el-button type="primary" @click="handleConfirm" :loading="loading">{{
        $t('confirm')
        }}</el-button>
    </el-popover>
</template>

<script lang="ts" setup>
import {SearchTagByName, DocumentAddTags} from 'dp-api';
const props = defineProps<{doc:any}>();
const { doc } = toRefs(props);
const popoverShow = ref(false)
    const loading = ref(false)

    const tagSelected = ref('')
    const handleConfirm = async () => {
      loading.value = true
      const param = {
        documentIdOrPath: props.doc.id,
        labels: [tagSelected.value],
      }
      const res = await DocumentAddTags(param)
      popoverShow.value = false
      loading.value = false
      if(!res) return
      emit('handleAdd', [tagSelected.value])
      tagSelected.value = ''
    }
    async function querySearchAsync (queryString, cb) {
      let result = await SearchTagByName(queryString)
      // 过滤已存在的tag
      if (props.doc.properties?.['nxtag:tags']) {
        const exitList = props.doc.properties['nxtag:tags']
        result = result.filter((allItem:any) => 
                !exitList.some((exitItem:any) => exitItem.label === allItem))
      }
      // 加上value
      result = result.reduce((tags,item) => {
        tags.push({ value: item })
        return tags
      }, [])
      
      cb(result)
    }

    watch(doc,
      (newValue) => {
        tagSelected.value = ''
    }, { immediate: true })
</script>
