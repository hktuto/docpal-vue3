import {Ref} from "vue-demi";
import {BPMNJSON} from "../../types";
import {removeFollowAllStep} from "../../utils";

/**
 * Remove the user task and following step in BpmnJson
 *
 * @param {Ref<BPMNJSON>} bpmnJson - The BPMN JSON object.
 * @param {any} data - The data object containing the attributes of the user task to be removed.
 */
export const removeUserTask = (bpmnJson: Ref<BPMNJSON>, data:any) => {
    if(Array.isArray(bpmnJson.value?.definitions?.process.userTask)) {
        const index = bpmnJson.value?.definitions?.process.userTask.findIndex(item => item.attr_id === data.attr_id);
        if(index > -1){
            bpmnJson.value.definitions.process.userTask.splice(index, 1);
        }
    }else{
        if(bpmnJson.value?.definitions?.process.userTask?.attr_id === data.attr_id){
            delete bpmnJson.value.definitions.process.userTask;
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
    }else if(bpmnJson.value.definitions.process.boundaryEvent.attr_id === otherToNode.attr_sourceRef){
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

export const removeUserTaskAndFollowing = (bpmnJson: Ref<BPMNJSON>, data:any) => {
    if(Array.isArray(bpmnJson.value?.definitions?.process.userTask)) {
        const index = bpmnJson.value?.definitions?.process.userTask.findIndex(item => item.attr_id === data.attr_id);
        if(index > -1){
            bpmnJson.value.definitions.process.userTask.splice(index, 1);
        }
    }else{
        if(bpmnJson.value?.definitions?.process.userTask?.attr_id === data.attr_id){
            delete bpmnJson.value.definitions.process.userTask;
        }
    }
    // get last connected node
    const otherToNode = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_targetRef === data.attr_id);

    // remove all edge related to this step
    removeFollowAllStep(data.attr_id, bpmnJson)
    if(otherToNode){
        bpmnJson.value.definitions.process.sequenceFlow.push({
            attr_id: 'sid' + new Date().getTime(),
            attr_sourceRef: otherToNode.attr_sourceRef,
            attr_targetRef: 'end'
        })
    }
}