<template>
<div>
    <el-popover
        :visible="popoverShow"
        width="300"
        popper-class="collectionPopover popover_050"
    >
        <template #reference>
            <img  class="cursorPointer" :src="'/icons/add.svg'"  @click="popoverShow = !popoverShow"/>
        </template>

        <!-- 内容 -->
        <div>
            <div class="title"> {{ $t('collections_add') }} </div>
            <div class="subTitle"> {{ $t('collections_caption') }} </div>
            <el-select
                v-model="selected"
                value-key="id"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                :placeholder="$t('choose')"
                class="collectionSelect"
            >
                <el-option
                    v-for="item in myCollection"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                >
                </el-option>
            </el-select>
            <el-button type="primary" @click="handleConfirm">{{ $t('confirm') }}</el-button>
        </div>
    </el-popover>
</div>
</template>

<script lang="ts" setup>
import {getCollectionApi, createCollectionApi, addCollectionApi} from 'dp-api'
const props = defineProps<{
  doc: any,
  exitList: any
}>()
const emit = defineEmits(['handleAdd']);
const allCollection = ref([])
const popoverShow = ref(false)

const selected = ref()
const myCollection = computed(() => {
    return allCollection.value.filter((allItem:any) => 
            !props.exitList.some((exitItem:any) => exitItem.name === allItem.name))
})

    const handleConfirm = async () => {
      const flag = await handleAddCollection()

      popoverShow.value = false
      if (!selected.value || !flag) {
        return
      }

      const param = {
        documents: [{ idOrPath: props.doc.id }],
        collection: { idOrPath: selected.value },
      }

      addCollectionApi(param).then((res) => {
        selected.value = ''
        if (!res) return
        emit('handleAdd', props.doc.id)
      })
    }
    const handleAddCollection = async () => {
      let flag = 0
      const index = myCollection.value.findIndex(
        (item) => item.path === selected.value
      )
      if (index !== -1) {return 1}
      const newCollection = await createCollectionApi({ name: selected.value })
      selected.value = newCollection.path
      flag = 1
      getCollection()
      return flag
    }
    async function querySearchAsync (queryString, cb) {
        let result = [ ...allCollection.value ]
        console.log(props.exitList, '------------------------');
        console.log({result});
        // 过滤已存在的tag
        if (props.exitList) {
            
            result = result.filter((allItem:any) => 
                    !props.exitList.some((exitItem:any) => exitItem.label === allItem))
        }
        // 加上value
        result = result.reduce((tags,item) => {
            tags.push({ value: item })
            return tags
        }, [])
        
        cb(result)
    }
    async function getCollection () {
        try {
            const res = await getCollectionApi()
            allCollection.value = res.entryList
        } catch (error) {
            allCollection.value = []
        }
    }
    onMounted(async() => {
        getCollection()
    })
</script>



<style lang="scss">
.collectionPopover {
  .title {
    color: var(--color-grey-600);
  }
  .subTitle {
    font-size: 0.6rem;
    color: var(--color-grey-400);
  }
  .el-button {
    width: 100%;
    margin-top: 1rem;
  }
  .collectionSelect {
    width: 100%;
    .el-input__inner {
      border: unset;
    }
  }
}
.popperSelect {
  .btn {
    font-size: 0.8rem;
    display: inline-block;
    color: var(--color-grey-600);
    margin: 1rem 0.5rem 0.5rem;
    cursor: pointer;
    // text-align: right;
    &:hover {
      background-color: wheat;
    }
  }
}
</style>