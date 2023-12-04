import {Ref} from "vue-demi";
import {BPMNJSON, ExclusiveGateway, ServiceTask, UserTask} from "../../types";
import {UserType} from "../userTask";
import {ServiceType} from "../serviceTask";
import {addExclusiveGateway} from "../exclusive";
import {addBoundaryTask} from "../boundary";

/**
 * 链接步骤
 *
 * @param {Ref<BPMNJSON>} bpmnJson - BPMN JSON 对象
 * @param {string} sourceData - 上一个步骤的 data
 * @param {any} newStepData - 新步骤的数据
 * @param {UserType | ServiceType} newStepType - 新步骤的类型
 */
export const linkSequenceFlow = (bpmnJson:Ref<BPMNJSON>, sourceData:UserTask | ServiceTask | ExclusiveGateway, newStepData:any, newStepType: UserType | ServiceType) => {
    if(sourceData.type === 'exclusiveGateway'){
        linkExclusiveSequenceFlow(bpmnJson, sourceData, newStepData, newStepType, false)
        return
    }
    const lastStepToOther = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_sourceRef === sourceData.attr_id);
    const lastStepTargetId = lastStepToOther.attr_targetRef
    const newStepSourceId = newStepData.attr_id
    if(newStepType === 'dueEmail') {
        // 如果是 due email, 新增 boundary 然後 return, 不用新增 sequenceFlow
        addBoundaryTask(bpmnJson, newStepData, sourceData.attr_id)
        return
    }
    if(newStepType === 'form' || newStepType === 'document' || newStepType === 'email') {
        // 如果是新增 Form, document, email 把 last Step sequenceFlow 的 targetId 赋值给 new Step
        lastStepToOther.attr_sourceRef = newStepSourceId
    }
    if(newStepType === 'approve') {
        console.log("newStepData", newStepType)
        // 如果是新增 Approve, 把 last Step 到下一步的 sequenceFlow 刪除
        const index  = bpmnJson.value.definitions.process.sequenceFlow.findIndex(item => item.attr_targetRef === lastStepTargetId && item.attr_sourceRef === sourceData.attr_id);
        bpmnJson.value.definitions.process.sequenceFlow.splice(index, 1);
        // 新增 exclusiveGateway
        addExclusiveGateway(bpmnJson, newStepData, lastStepTargetId)
    }
    
    // 連結 last step 到 new step
    bpmnJson.value.definitions.process.sequenceFlow.push({
        attr_sourceRef: sourceData.attr_id,
        attr_targetRef: newStepSourceId
    })
}


export const linkExclusiveSequenceFlow = (bpmnJson: Ref<BPMNJSON>, sourceData:UserTask | ServiceTask | ExclusiveGateway, newStepData:any, newStepType: UserType | ServiceType ) => {
    const replaceSeq = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_sourceRef === sourceData.attr_id && (sourceData.approve ? !item.conditionExpression.__cdata.includes('!') : item.conditionExpression.__cdata.includes('!')))
    if(!replaceSeq){
        bpmnJson.value.definitions.process.sequenceFlow.push({
            attr_sourceRef: sourceData.attr_id,
            attr_targetRef: newStepData.attr_id
        })
        return
    }
    const nextStep = replaceSeq.attr_targetRef
    replaceSeq.attr_targetRef = newStepData.attr_id;
    if(newStepType === 'approve'){
        addExclusiveGateway(bpmnJson, newStepData, nextStep)
    }else{
        
        bpmnJson.value.definitions.process.sequenceFlow.push({
            attr_sourceRef: newStepData.attr_id,
            attr_targetRef: nextStep
        })
    }
    // TODO : need to check if it is the last step
}