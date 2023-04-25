<template>
    <div class="preview-container"
        :style="`--img-size:${state.imgSize}px;`" @contextmenu="(event) => handleRightClick(doc, event)">
        <div class="preview-main">
            <div v-if="state.tableData.length === 0" class="emptyList">
                empty list
            </div>
            <div v-for="item in state.tableData" :key="item.id"
                class="doc-container"
                @dblclick="handleDblclick(item)" 
                @contextmenu.stop="(event) => handleRightClick(item, event)">
                <template v-if="item.blobUrl">
                    <img :src="item.blobUrl" class="thumbnail"/>
                </template>
                <template v-else>
                    <BrowseItemIcon :type="item.isFolder ? 'folder' : 'file'"/>
                </template>
                <div class="name">{{item.name}}</div>
            </div>
        </div>
        <div class="footer">
            <el-input-number v-model="state.imgSize" :step="20" :min="60" :max="200" @change="handleChange" />
            <el-pagination
                v-bind="pageParams"
                @size-change="(pageSize) => handlePaginationChange(1, pageSize)"
                @current-change="(pageNum) => handlePaginationChange(pageNum, pageParams.pageSize)" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GetChildThumbnail, DocumentThumbnailGetApi, TABLE, defaultTableSetting } from 'dp-api'
const route = useRoute()
const router = useRouter()
const props = defineProps<{doc:true}>();
const emit = defineEmits([
    'select-change'
])
const state = reactive<State>({
    loading: false,
    tableData: [],
    imgSize: 100
})
// #region module: page 
    const pageParams = ref({
        idOrPath: '/',
        total: 0,
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper',
    })
    async function getList (param) {
        state.loading = true
        const res = await GetChildThumbnail(param)
        state.tableData = []
        res.entryList.forEach(async (item) => {
            if (!item.isFolder) {
                const blob = await DocumentThumbnailGetApi(item.id)
                if (!!blob) {
                    const urlCreator = window.URL || window.webkitURL
                    item.blobUrl = urlCreator.createObjectURL(blob)
                } 
            }
            state.tableData.push({...item})
        })
        pageParams.value.currentPage = param.pageNumber + 1
        pageParams.value.total = res.totalSize
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number, path?: string, isFolder?: boolean) {
        if(!pageSize) pageSize = pageParams.value.pageSize
        const time = new Date().valueOf().toString()
        
        router.push({ 
            query: { page, pageSize, time, path: path || pageParams.value.idOrPath, isFolder} 
        })
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize, path, isFolder } = newval
            // 点击导航头时，isFolder 为 undefined,需要排除 undefined 的情况
            if (isFolder === 'false') return
            pageParams.value.idOrPath = path || pageParams.value.idOrPath
            pageParams.value.pageIndex = page ? (Number(page) - 1) : 0
            pageParams.value.pageSize = Number(pageSize) || pageParams.value.pageSize
            getList({pageNumber: pageParams.value.pageIndex, pageSize: pageParams.value.pageSize, idOrPath:  pageParams.value.idOrPath})
        },
        { immediate: true }
    )
// #endregion
function handleDblclick (row) {
    handlePaginationChange(1, pageParams.value.pageSize, row.path, row.isFolder)
}
function handleRightClick (item, event) {
    event.preventDefault();
    const data = {
        isFolder: true,
        idOrPath: item.path,
        pageX: event.pageX,
        pageY: event.pageY,
        doc: item
    }
    const ev = new CustomEvent('fileRightClick',{ detail: data })
    document.dispatchEvent(ev)
}
</script>
<style lang="scss" scoped>
.preview-container {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content;
    row-gap: var(--app-padding);
    .preview-main {
        overflow: auto;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;
        gap: calc(var(--app-padding) * 2);
        color: var(--color-grey-700);
        > *{
            width: calc(var(--img-size) + var(--app-padding) * 2);
        }
    }
}
.footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.doc-container {
    .thumbnail {
        aspect-ratio: 1/1;
        background: var(--color-grey-200);
        border-radius: 0.5rem;
        overflow: hidden;
        width: 100%;
        position: relative;
    }
    .name {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-break: break-all;
    }
}
.iconContainer {
    :deep(img) {
        aspect-ratio: 1/1;
        border-radius: 0.5rem;
        overflow: hidden;
        width: 100%;
        position: relative;
    }
}
</style>