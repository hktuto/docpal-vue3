import {Ref} from "vue-demi";
import {BPMNJSON} from "../../types";


/**
 * Removes a service task from a BPMN JSON object.
 *
 * @param {Ref<BPMNJSON>} bpmnJson - The BPMN JSON object to modify.
 * @param {any} data - The data of the service task to remove.
 */
export const removeServiceTask = (bpmnJson: Ref<BPMNJSON>, data:any ) => {
    if(Array.isArray(bpmnJson.value?.definitions?.process.serviceTask)) {
        const index = bpmnJson.value?.definitions?.process.serviceTask.findIndex(item => item.attr_id === data.attr_id);
        if(index > -1){
            
            bpmnJson.value.definitions.process.serviceTask.splice(index, 1);
        }
    }else{
        if(bpmnJson.value?.definitions?.process.serviceTask?.attr_id === data.attr_id){
            delete bpmnJson.value.definitions.process.serviceTask;
        }
    }
    const otherToNode = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_targetRef === data.attr_id);
    const nodeToOther = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_sourceRef === data.attr_id);
    // check if otherToNode is boundary event, if true, remove boundary event, then skip link back
    
    if(Array.isArray(bpmnJson.value.definitions.process.boundaryEvent)){
        const index = bpmnJson.value.definitions.process.boundaryEvent.findIndex(item => item.attr_id === otherToNode.attr_sourceRef);
        if(index > -1){
            bpmnJson.value.definitions.process.boundaryEvent.splice(index, 1);
        }
    }else if(bpmnJson.value.definitions.process.boundaryEvent && bpmnJson.value.definitions.process.boundaryEvent.attr_id === otherToNode.attr_sourceRef){
        delete bpmnJson.value.definitions.process.boundaryEvent;
        
    }
    if(!nodeToOther) {
        // if no node To Other, remove sequenceFlow
        const index = bpmnJson.value.definitions.process.sequenceFlow.findIndex(item => item.attr_id === otherToNode.attr_id);
        if(index > -1){
            bpmnJson.value.definitions.process.sequenceFlow.splice(index, 1);
        }
        return;
    }
    // if no node To Other, remove sequenceFlow
    
    // link other node attr_sourceRef to nodeToOther.attr_targetRef
    if(otherToNode && nodeToOther){
        otherToNode.attr_targetRef = nodeToOther.attr_targetRef ;
    }
    // remove nodeToOther
    if(nodeToOther){
        const index = bpmnJson.value.definitions.process.sequenceFlow.findIndex(item => item.attr_id === nodeToOther.attr_id);
        if(index > -1){
            bpmnJson.value.definitions.process.sequenceFlow.splice(index, 1);
        }
    }
}