
<script lang="ts" setup>
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';

import {useGraph} from '../../composables/userGraph';

///#region setup
    const props = defineProps({
        bpmn: {
            type: String,
            default: ""
        }
    });
    const parser = new XMLParser( { 
            ignoreAttributes: false,
            attributeNamePrefix : "attr_",
            cdataPropName:     "__cdata",
            allowBooleanAttributes: true,
            parseAttributeValue: true
        });
    const builder = new XMLBuilder(
        { 
            ignoreAttributes: false,
            attributeNamePrefix : "attr_",
            cdataPropName:     "__cdata",
            allowBooleanAttributes: true,
            suppressBooleanAttributes: false
        }
    );

    const { bpmn } = toRefs(props);
    const scale = ref(1);
    const data = ref();
    const process = ref();

    // 如果props.bpmn有值，就转换成 js 对象
    onMounted(() => {
        bpmnToJs();
    })
///#endregion setup

/// #region antV6
const {generateMap} = useGraph('editorContainer');

/// #endregion antV6

function bpmnToJs() {
    const tempD = parser.parse(props.bpmn,);

    if(tempD['?xml']){
        delete tempD['?xml'];
    }
    data.value = tempD;
    process.value = data.value['definitions']['process'];
    generateMap();
    // data.value = convert.xml2js(props.bpmn, { compact: true, spaces: 4 });
}

function jsToBpmn() {
    const xml = builder.build(data?.value);
    console.log(xml);
    // add xml header
}

function createEmptyData(){
    data.value = {};
}




</script>

<template>
    <div style="overflow:auto">
        <Button @click="bpmnToJs">bpmnToJs</Button>
        <Button @click="jsToBpmn">jsToBpmn</Button>
        <div id="editorContainer">

        </div>
    </div>
</template>

<style lang="scss" scoped>
#editorContainer{
    width: 100%;
    height:100%;
}
</style>
