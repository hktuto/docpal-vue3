import {Ref} from "vue-demi";
import {BPMNJSON} from "../../types";

/**
 * Retrieves the exclusive event sequence for a given source ID.
 *
 * @param {string} sourceId - The ID of the Exclusive Gateway.
 * @param {boolean} approve - A boolean value indicating whether the event is approve.
 * @param {Ref<BPMNJSON>} bpmnJson - The BPMN JSON reference.
 */
export const getExclusiveEventSeq = (sourceId:string, approve:boolean, bpmnJson: Ref<BPMNJSON>):string => {
    const seq = bpmnJson.value.definitions.process.sequenceFlow.filter(item => item.attr_sourceRef === sourceId)

    if(approve){
        const approveItem = seq.find(item => !item.conditionExpression.__cdata.includes('!'))
        return approveItem.attr_targetRef
    }else{
        const rejectItem = seq.find(item => item.conditionExpression.__cdata.includes('!'))
        return rejectItem.attr_targetRef
    }
}