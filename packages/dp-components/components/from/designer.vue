<template>
    <v-form-designer ref="vFormDesignerRef" :designer-config="designerConfig"></v-form-designer>
</template>

<script lang="ts" setup>
const vFormDesignerRef = ref()
const designerConfig = {
    languageMenu: false,  //是否显示语言切换菜单
    externalLink: false,  //是否显示GitHub、文档等外部链接
    formTemplates: false,  //是否显示表单模板
    eventCollapse: true,  //是否显示组件事件属性折叠面板
    widgetNameReadonly: false,  //禁止修改组件名称

    clearDesignerButton: true,  //是否显示清空设计器按钮
    previewFormButton: true,  //是否显示预览表单按钮
    importJsonButton: true,  //是否显示导入JSON按钮
    exportJsonButton: true,  //是否显示导出JSON器按钮
    exportCodeButton: false,  //是否显示导出代码按钮
    generateSFCButton: false,  //是否显示生成SFC按钮

    toolbarMaxWidth: 450,  //设计器工具按钮栏最大宽度（单位像素）
    toolbarMinWidth: 300,  //设计器工具按钮栏最小宽度（单位像素）

    presetCssCode: '',  //设计器预设CSS样式代码

    resetFormJson: false,  //是否在设计器初始化时将表单内容重置为空
}
function setFormJson (json) {
    vFormDesignerRef.value.clearDesigner()
    vFormDesignerRef.value.refreshDesigner()
    vFormDesignerRef.value.setFormJson(json)
}
function getFormJson () {
    return vFormDesignerRef.value.getFormJson()
}
defineExpose({ setFormJson, getFormJson })
</script>

<style scoped>

</style>