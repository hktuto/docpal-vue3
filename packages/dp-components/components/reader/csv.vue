<template>
    <template v-if="state.tableData.length > 0">
        <div class="layoutTable">
            <div style="overflow: hidden;">
                <el-table :data="state.displayData" style="height: 100%;">
                    <el-table-column v-for="item in state.headers" :prop="item.key" :label="item.key" width="180" />
                </el-table>
            </div>
            <el-pagination layout="prev, pager, next" :page-size="state.pageSize" :total="state.tableData.length" @current-change="getData"/>
        </div>
    </template>
    <template v-else>
        <div class="docxContainer" :loading="props.loading || state.vLoading">
                <div v-for="item in state.lines">{{item}}</div>
        </div>
    </template>
</template>

<script lang="ts" setup>
const props = defineProps<{
    annotations: Map<string,any>,
    blob: Blob,
    name: String,
    options: PdfJsOptions,
    loading: Boolean
}>();
const state = reactive({
    lines: [],
    headers: [],
    tableData: [],
    displayData: [],
    vLoading: false,

    pageSize: 20
})
const refWord = ref()
function blobToFile(blob, fileName) {
	return new File([blob], fileName, {type: blob.type});
}

function fileRead (file) {
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsText(file)
        state.vLoading = true
        reader.onload = (e) => {
            const contents = e.target.result;
            const lines = contents.split('\n');
            const headers = lines[0].split(',')
            state.lines = lines;
            state.headers = headers.map(item => ({
                title: item,
                dataKey: item,
                key: item.replace(/ /g, '-')
            }))
            state.tableData = [];
            for (let i = 1; i < lines.length; i++) {
                const fields = lines[i].split(',');
                const record = {};
                for (let j = 0; j < state.headers.length; j++) {
                    record[state.headers[j].key] = fields[j];
                }
                state.tableData.push(record);
            }
            getData(1)
            state.vLoading = false
        };
    })
}
function getData(pageNum) {
    state.displayData = state.tableData.slice((pageNum - 1) * state.pageSize, pageNum * state.pageSize);
}
watch(() => props.blob, async(newBlob) => {
    const fileObj = blobToFile(newBlob, 'text.csv')
    fileRead(fileObj)
}, {
    immediate: true
})
</script>

<style lang="scss" scoped>
.docxContainer{
    height: 100%;
    overflow: auto;
}
.layoutTable {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr min-content;
}
</style>
