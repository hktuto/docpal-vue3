
<script lang="ts" setup>
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
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
const data = ref();
const process = ref();

type StepFormField = {
    id: string,
    name: string,
    type: string,
    datePattern?:string
    readable ?: boolean
}

type Step = {
    id: string,
    name: string,
    formFieldValidation: boolean,
    formProperty: StepFormField[],
    candidateGroups ?: string,
    type: "UserTask" | "ServiceTask" | "StartEvent" | "EndEvent" | "ExclusiveGateway" | "ParallelGateway" | "InclusiveGateway",
}
type StepLink = {
    id:string,
    sourceRef: Step,
    targetRef: Step,
}
const sequence = ref();
function sequenceFlow(){
    const step = process.value['sequenceFlow'];
    // loop step


}

function bpmnToJs() {
    const tempD = parser.parse(props.bpmn,);

    if(tempD['?xml']){
        delete tempD['?xml'];
    }
    data.value = tempD;
    process.value = data.value['definitions']['process'];
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


watch(bpmn, () => {
    if(bpmn.value) {
        bpmnToJs();
    }else{
        createEmptyData()
    }
},{
    immediate: true
});

</script>

<template>
    <div style="overflow:auto">
        <Button @click="bpmnToJs">bpmnToJs</Button>
        <Button @click="jsToBpmn">jsToBpmn</Button>
        <pre>
            {{ process }}
        </pre>
    </div>
</template>
