<template>
<div style="margin: 20px">
  <!-- <el-input
    type="textarea"
    :autosize="{ minRows: 5, maxRows: 20}"
    placeholder="请输入内容"
    v-model="test">
  </el-input> -->
    <section>
        <h4>用于语言翻译</h4>
        <el-button @click="download(true)">获取workflow所有key并下载为xlsx表</el-button><br/><br/>
    </section>
    <section v-show="false">
        <h4>用于complete page</h4>
        <el-button  @click="setJson()">统一修改workflow为唯一名称label</el-button>
    </section>
    <section v-show="false">
        <h4>用于设置fileMaxSize</h4>
        <el-button v-show="false" @click="handleSetMeta('fileMaxSize', 0)">统一修改workflow为fileMaxSize为0</el-button>
    </section>
    <section v-show="false">
        <h4>用于设置fileMaxSize</h4>
        <el-button @click="handleDocpalToken()">统一删除docpal-token</el-button>
    </section>
    <section>
        <h4>用于complete page</h4>
        <el-input style="width:40%" v-model="disabledKey" placeholder="请输入需要disabled的流程Id" />
        <el-input style="width:200px" v-model="disabledTaskId" placeholder="请输入需要disabled的taskId" />

        <el-button @click="logDisabledJson(disabledKey)">打印disabled:json - 用于complete page</el-button>
    </section>
    <section>
        <h4>用于后端数据结构改变更换前端数据结构</h4>
        <el-button @click="replaceResData()">统一替换res.data为res.data.data</el-button>
        <el-button @click="replaceResData('res.data.data.data', 'res.data.data')">统一替换res.data.data.data为res.data.data</el-button>
    </section>
</div>
</template>

<script lang="ts" setup>
import { api } from 'dp-api'
async function getData () {
    const response = await api.get('/docpal/workflow/process/getProcessDefinitionList');
    return response.data.data
}
// #region module:  download
    async function download () {
        const arr = await getData()
        console.log({arr});
        const result = []
        arr.forEach(arrItem => {
        arrItem.userTasks.forEach(taskItem => {
            taskItem.formProperties.forEach(propertiesItem => {
                const index = result.findIndex(resultItem => resultItem.key === propertiesItem.id)
                if(index === -1) result.push({key: propertiesItem.id, value: propertiesItem.name})
            })
        })
        });
        jsonToXlsx(result)
    }
    function jsonToXlsx (exportArr) {
        // 自定义下载的header，注意是数组中的数组哦
        const Header = [['key', 'value']];
        const XLSX = require("xlsx");
        // 将JS数据数组转换为工作表。
        const headerWs = XLSX.utils.aoa_to_sheet(Header);
        const ws = XLSX.utils.sheet_add_json(headerWs, exportArr, {skipHeader: true, origin: 'A2'});
        /* 新建空的工作表 */
        const wb = XLSX.utils.book_new();

        // 可以自定义下载之后的sheetname
        XLSX.utils.book_append_sheet(wb, ws, 'sheetName');

        /* 生成xlsx文件 */
        XLSX.writeFile(wb, '下载.xlsx');
    }
// #endregion
// #region module: json label快速修改
    async function getJson (param) {
        const response = await api.get('/docpal/relation/query', {params: param} );
        return response.data.data
    }
    async function saveJson(params) {
        const response = await api.post('/docpal/relation/save', params);
        return response.data
    }
    async function setJson() {
        const arr = await getData()
        const result = []
        arr.forEach(arrItem => {
            arrItem.userTasks.forEach(taskItem => {
                result.push({processKey: arrItem.key, userTaskId: taskItem.id })
            })
            result.push({processKey: arrItem.key, userTaskId: 'complete' })
        });
        result.forEach(async resultItem => {
            const data = await getJson(resultItem)
            data[0].jsonValue = setLabel(data[0].jsonValue)
            saveJson(data[0])
        })
    }
    function setLabel (data) {
        data = JSON.parse(data)
        recursion(data.widgetList)
        function recursion (list) {
        list.forEach(item => {
            if (item.cols && item.cols.length > 0) {
                item.cols.forEach(colsItem => {
                    recursion(colsItem.widgetList)
                })
            } else if(item.options.label.includes('divider')) {
                item.options.label = 'auditOpinion'
            }
            else if(!item.options.label.includes('auditOpinion')){ 
                item.options.label = item.options.name
            }
        })
        }
        return JSON.stringify(data)
    }
// #endregion
// #region module: handleSetMeta
    async function handleSetMeta (meta, value) {
        const arr = await getData()
        const result = []
        arr.forEach(arrItem => {
            arrItem.userTasks.forEach(taskItem => {
                result.push({processKey: arrItem.key, userTaskId: taskItem.id })
            })
            result.push({processKey: arrItem.key, userTaskId: 'complete' })
        });
        result.forEach(async resultItem => {
            const data = await getJson(resultItem)
            data[0].jsonValue = setMeta(data[0].jsonValue, meta, value)
            saveJson(data[0])
        })
    }
    function setMeta (data, meta, value) {
        data = JSON.parse(data)
        recursion(data.widgetList)
        function recursion (list) {
            list.forEach(item => {
                if (item.cols && item.cols.length > 0) {
                    item.cols.forEach(colsItem => {
                        recursion(colsItem.widgetList)
                    })
                }
                if (item.rows && item.rows.length > 0) {
                    item.rows.forEach(rowsItem => {
                        rowsItem.cols.forEach(colsItem => {
                        recursion(colsItem.widgetList)
                        })
                    })
                }
                else if(item.options[meta] || item.options[meta] === false) { 
                    item.options[meta] = value
                }
            })
        }
        return JSON.stringify(data)
    }
// #endregion
// #region module: 将字段全部设为 disabled
    const disabledKey = ref('skhschEventBugetSettlement')
    const disabledTaskId = ref('start')
    async function logDisabledJson (processKey) {
        const data = await getJson({processKey, userTaskId: disabledTaskId.value})
        const json = setMeta(data[0].jsonValue, 'disabled', true)
        console.log('当前打印key:' ,processKey);
        console.log({json});
        copy(json)
    }
    const copy = (copyContent) => {
        const input = document.createElement('input')
        document.body.appendChild(input)
        input.value = copyContent
        input.focus()
        input.select()
        document.execCommand('Copy')
        document.body.removeChild(input)
        window.alert('Copy 成功')
    }
// #endregion
// #region module: 清除docpal-token
    async function handleDocpalToken() {
        const arr = await getData()
        const result = []
        arr.forEach(arrItem => {
        arrItem.userTasks.forEach(taskItem => {
            result.push({processKey: arrItem.key, userTaskId: taskItem.id })
        })
        result.push({processKey: arrItem.key, userTaskId: 'complete' })
        });
        result.forEach(async resultItem => {
            const data = await getJson(resultItem)
            data[0].jsonValue = setDocpalTokenNone(data[0].jsonValue)
            saveJson(data[0])
        })
    }
    function setDocpalTokenNone (data) {
        data = JSON.parse(data)
        recursion(data.widgetList)
        function recursion (list) {
            list.forEach(item => {
                if (item.cols && item.cols.length > 0) {
                    item.cols.forEach(colsItem => {
                        recursion(colsItem.widgetList)
                    })
                } else if(!!item.options.onCreated && item.options.onCreated.includes('docpal-token')){
                    item.options.onCreated = ''
                }
            })
        }
        return JSON.stringify(data)
    }
// #endregion

// #region module: 将res.data替换为res.data.data
    async function replaceResData (key1: string = 'res.data', key2: string = 'res.data.data') {
        const arr = await getData()
        const result = []
        arr.forEach(arrItem => {
            arrItem.userTasks.forEach(taskItem => {
                result.push({processKey: arrItem.key, userTaskId: taskItem.id })
            })
            result.push({processKey: arrItem.key, userTaskId: 'complete' })
        });
        result.forEach(async resultItem => {
            const data = await getJson(resultItem)
            if( data[0] && data[0].jsonValue) {
                let jsonValue = data[0].jsonValue
                data[0].jsonValue = jsonValue.replaceAll(key1, key2);
                console.log(data[0].jsonValue);
                saveJson(data[0])
            }
        })
    }
// #endregion
</script>
