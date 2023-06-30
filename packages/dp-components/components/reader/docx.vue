<template>
<div class="docxContainer">
     <div class="docxMain" ref="refWord" />
</div>
</template>

<script lang="ts" setup>
import { renderAsync } from 'docx-preview'
const props = defineProps<{
    annotations: Map<string,any>,
    blob: Blob,
    name: String,
    options: PdfJsOptions,
    loading: Boolean
}>();
const state = reactive({
    imgUrl: ''
})
const refWord = ref()
watch(() => props.blob, async(newBlob) => {
    console.log(newBlob, 'ddddddddddddddddddddddddddddddddddd');
    
   const options = {
        className: 'docx', // 默认和文档样式类的类名/前缀
        inWrapper: true, //  启用围绕文档内容渲染包装器
        ignoreWidth: false, //  禁止页面渲染宽度
        ignoreHeight: false, //  禁止页面渲染高度
        ignoreFonts: false, //  禁止字体渲染
        breakPages: true, //  在分页符上启用分页
        ignoreLastRenderedPageBreak: true, //  禁用lastRenderedPageBreak元素的分页
        experimental: false, //  启用实验性功能（制表符停止计算）
        trimXmlDeclaration: true, //   如果为真，xml声明将在解析之前从xml文档中删除
        debug: false, //  启用额外的日志记录
        useBase64URL: true, // 如果为true，图片、字体等将被转换为base 64 URL，否则使用URL.createObjectURL
        useMathMLPolyfill: false, //  包括用于 chrome、edge 等的 MathML polyfill。
        showChanges: false // 启用文档更改（插入/删除）的实验性呈现
    }
    setTimeout(() => {

        console.log(refWord.value);
        renderAsync(newBlob , refWord.value)
    })
    
}, {
    immediate: true
})
</script>

<style lang="scss" scoped>
.docxContainer{
    height: 100%;
    overflow: auto;
}
</style>
