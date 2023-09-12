<template>
    <div id="editorEl">

    </div>
</template>

<script lang="ts" setup>
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import  Paragraph from '@editorjs/paragraph';
import VariableOptions from '../../editorComponents/variableOptions';
import VariableSelect from '../../editorComponents/variableSelect';
const props = withDefaults(defineProps<{
    options:any,
    data:any,
    variable:any
}>(),{
    options:{},
    data:{},
    variable:[]
})

const { variable } = toRefs(props);
const editor = ref<EditorJS | null>(null);
function setupEditor() {
    // init editorjs
    editor.value = new EditorJS({
        holderId: 'editorEl',
        autofocus: true,
        data: props.data,
        tools:{
            header: {
                class: Header,
                inlineToolbar: true,
            },
            list : {
                class: NestedList,
                inlineToolbar: true,
            },
            table:{
                class: Table,
                inlineToolbar: true,
            },
            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },
            VariableOptions: {
                class: VariableOptions,
                config:{
                    variables: variable.value
                }
            },
            // variableOptions: {
            //     class: VariableOptions,
            //     config:{
            //         variables: variable.value
            //     }
            // },
            // VariableSelect:{
            //     class: VariableSelect,
            //     config:{
            //         variables: variable.value
            //     }
            // }
        },
        i18n:{
            messages:{
                toolNames: {
                    "Text": "Text",
                    "Heading": "Heading",
                    "List": "List",
                    "Warning": "Warning",
                    "Checklist": "Checklist",
                    "Quote": "Quote",
                    "Delimiter": "Delimiter",
                    "Table": "Table",
                    "Link": "Link",
                    "Marker": "Marker",
                    "Bold": "Bold",
                    "Italic": "Italic",
                    "InlineCode": "InlineCode",
                },
                blockTunes: {
                    /**
                     * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
                     * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
                     *
                     * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
                     */
                    "delete": {
                        "Delete": "Delete"
                    },
                    "moveUp": {
                        "Move up": "Move up"
                    },
                    "moveDown": {
                        "Move down": "Move down"
                    }
                },
            }
        },
        onChange: (api, event) => {
            const data = api.saver.save().then((outputData) => {
                calculateVariable(outputData);
            });
        },
    })
}

function dispose(){
    editor.value?.destroy();
    editor.value = null;
}
async function setData(data:any) {
    await editor.value?.isReady;
    await editor.value?.render(data);
}
async function getData() {
    const outputData = await editor.value?.save();
    return outputData;
}

async function getHTML() {
    const outputData = await editor.value?.save();
    const html = "";
    if(!outputData) return;
    for( const block of outputData.blocks) {
        console.log(block)
    }
    return html
}

function calculateVariable(data:any) {
    const variable = [];
    for( const block of data.blocks) {
        if(block.type === 'variableOptions') {
            variable.push(block.data.variable)
        }
    }
}

onMounted(() => {
    setupEditor();
})


onUnmounted(() => {
    dispose();
})

watch(() => props.data, async (data) => {
    await setData(data);
})

defineExpose({
    getData,
    getHTML,
    setData
})
</script>

<style scoped>
#editorEl {
    width: 100%;
    height: 100%;
}
</style>../../editorComponents/VariableOptions