<template>
<div class="card-container" >
    <el-card class="card">
        <el-select v-model="state.selectedSection" @change="GetLanguages">
            <el-option v-for="section in state.sections" :key="section" :value="section" :label="section"/>
        </el-select>
        <div class="divider">
            <template v-for="item in state.locales">
                {{item.code}}<el-divider direction="vertical" />
            </template>
            <el-button :loading="state.getLoading" text></el-button>
        </div>
        
        <div class="card-footer" v-show="state.selectedSection">
            <el-button :disabled="state.getLoading" @click="downLoadXlsx">下载{{state.selectedSection}}.xlsx</el-button>
            <el-button :disabled="state.getLoading" :loading="state.loading" @click="uploadXlsx" >上传{{state.selectedSection}}.xlsx
                <input v-show="false"  ref="inputRef" type="file" accept=".csv,.xls,.xlsx" @change="handleFile"/>
            </el-button>
        </div>
    </el-card>
</div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import { GetAvailableLanguage, GetLanguageApi, SetLanguageApi } from 'dp-api'
type TranslationSection = "client" | "admin" | "meta"
const state = reactive({
    loading: false,
    getLoading: false,
    selectedSection: 'client',
    sections: [ "client", "admin", "meta"],
    locales: [],
    languageStores: {}
})
// #region module: downLoadXlsx
    async function downLoadXlsx() {
        let res = {}
        state.locales.forEach(async(item) => {
            const key = getStoreKey(item.code)
            const l = state.languageStores[key].languageContent
            res = flattenJSON(l, item.code, res)
        })
        const arr = jsonToArray(res)
        jsonToXlsx(arr, state.selectedSection)
    }
    
    function flattenJSON (obj = {}, locale, res = {}, extraKey = '') {
        Object.keys(obj).forEach(key => {
            if(typeof obj[key] !== 'object'){
            if(!res[extraKey + key]) res[extraKey + key] = {}
            res[extraKey + key][locale] = obj[key];
            }else{
            flattenJSON(obj[key], locale, res, `${extraKey}${key}.`);
            }
        })
        return res;
    }
    function jsonToArray (obj = {}) {
        const result = []
        Object.keys(obj).forEach(key => {
            result.push({ 
            key: key,
            'zh-CN': obj[key]['zh-CN'],
            'zh-HK': obj[key]['zh-HK'],
            'en-US': obj[key]['en-US']
            // ...obj[key]
            })
        })
        return result;
    }
    function jsonToXlsx (exportArr, name) {
        const Header = [['key', 'zh-CN', 'zh-HK', 'en-US']];
        const headerWs = XLSX.utils.aoa_to_sheet(Header);
        const ws = XLSX.utils.sheet_add_json(headerWs, exportArr, {skipHeader: true, origin: 'A2'});
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'sheetName');
        XLSX.writeFile(wb, `${name}.xlsx`);
    }
// #endregion

// #region module: uploadXlsx
    const inputRef = ref()
    
    function uploadXlsx() { inputRef.value.click() } 
    async function handleFile(event) {
        state.loading = true
        const res = await xlsxToJson(event.target.files[0])
        event.target.value = ''
        const json = {
            'en-US': {},
            'zh-CN': {},
            'zh-HK': {}
        }
        res.forEach(item => {
            Object.keys(json).forEach(key => {
                json[key][item.key] = item[key]
            })
        })
        Object.keys(json).forEach(key => {
            json[key] = restoreChainJson(json[key])
        })
        handleUpload(json)
    }
    async function handleUpload (json) {
        const pList = []
        state.locales.forEach(item => {
            const key = getStoreKey(item.code)
            const params = { 
                ...state.languageStores[key],
                languageContent: JSON.stringify(json[item.code])
            }
            pList.push(SetLanguageApi(params))
        })
        const res = await Promise.all(pList)
        GetLanguages()
        const result = res.reduce((falseList, item, index) => {
            if(!item) falseList.push(index)
            return falseList
        }, [])
        
        if (result.length === 0) {
            ElMessage.success(`${$i18n.t('dpMsg_success')}`)
        }
        else ElMessage.error(`${$i18n.t('dpMsg_error')}`)
        setTimeout(() => { state.loading = false }, 200)
    }
    function xlsxToJson(file, start: Number = 0): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = e => {
            try {
                const data = e.target.result; // 获取的数据
                const workBook = XLSX.read(data, { type: 'binary', cellDates: true }) // data转xlsx数据对象
                let sheetNames = workBook.SheetNames || []
                let sheetDatas = workBook.Sheets || []
                let datas = sheetDatas[sheetNames[0]];
                let result = XLSX.utils.sheet_to_json(datas, { range: start, defval: ' ', header: 2 });// range: 2代表从第几行开始读取，defval是为空属性设置默认值
                resolve(result);
            } catch (error) {
                reject(error)
            }
            }
            fileReader.readAsBinaryString(file);
        })
    }
    function restoreChainJson (json) {
        const result = {}
        let _result = {}
        Object.keys(json).forEach(key => {
            const keys = key.split('.')
            _result = result
            keys.forEach((item, index) => {
                if(index === keys.length - 1) {
                    _result[item] = json[key]
                } else {
                if(!_result[item]) _result[item] = {}
                    _result = _result[item]
                }
            })
        })
        return result
    }
// #endregion
// #region module: getLocales
    async function GetLanguages () {
        const pList = []
        state.getLoading = true
        state.locales.forEach(async (item) => {
            pList.push(getLanguage(item.code))
        })
        await Promise.all(pList);
        setTimeout(() => {
            state.getLoading = false
        }, 1000)
        async function getLanguage(code) {
            const key = getStoreKey(code)
            state.languageStores[key] = await GetLanguageApi(code, state.selectedSection)
        }
    }
    function getStoreKey (code) {
        return code + '-' + state.selectedSection
    }
// #endregion
onMounted(async() => {
    state.locales = await GetAvailableLanguage()
    GetLanguages()
})
</script>

<style lang="scss" scoped>
.card-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    :deep .el-card__body {
        display: flex;
        flex-direction: column;
        gap: var(--app-padding);
    }
    
    .card {
        width: 800px;
        height: fit-content;
    }
    .divider .el-divider:last-child {
        display: none;
    }
}
</style>