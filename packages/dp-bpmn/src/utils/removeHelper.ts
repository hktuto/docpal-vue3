import {Ref} from "vue-demi";
import {BPMNJSON} from "../types";


export const removeFollowAllStep = (stepId:string, bpmnJson:Ref<BPMNJSON>) => {
    const nextSteps = bpmnJson.value.definitions.process.sequenceFlow.filter(item => item.attr_sourceRef === stepId)
    // add boundary event to nextSteps
    if(Array.isArray(bpmnJson.value.definitions.process.boundaryEvent)){
        const item = bpmnJson.value.definitions.process.boundaryEvent.find((item:any) => item.attr_attachedToRef === stepId)
        if(item){
            nextSteps.push(...bpmnJson.value.definitions.process.sequenceFlow.filter(seq => seq.attr_sourceRef === item.attr_id))
        }
    }else if(bpmnJson.value.definitions.process.boundaryEvent.attr_attachedToRef === stepId){
        nextSteps.push(...bpmnJson.value.definitions.process.sequenceFlow.filter(seq => seq.attr_sourceRef === bpmnJson.value.definitions.process.boundaryEvent.attr_id))
    }
    removeStepById(stepId, bpmnJson)
    // remove current step 

    bpmnJson.value.definitions.process.sequenceFlow = bpmnJson.value.definitions.process.sequenceFlow.filter(item => item.attr_targetRef !== stepId)

    if(nextSteps.length > 0){
        nextSteps.forEach( (step:any) => {
            bpmnJson.value.definitions.process.sequenceFlow = bpmnJson.value.definitions.process.sequenceFlow.filter(item => item.attr_id !== step.attr_id)

            if(step.attr_id === 'end'){
                return;
            }
            removeStepById(step.attr_targetRef, bpmnJson)

            return removeFollowAllStep(step.attr_targetRef, bpmnJson)
        })
    }

}


export const removeStepById = (attr_id:string, bpmnJson:Ref<BPMNJSON>) => {
    // remove step
    if(Array.isArray(bpmnJson.value.definitions.process.serviceTask)){
        const item = bpmnJson.value.definitions.process.serviceTask.find((item:any) => item.attr_id === attr_id)
        if(item){
            bpmnJson.value.definitions.process.serviceTask = bpmnJson.value.definitions.process.serviceTask.filter((item:any) => item.attr_id !== attr_id)
        }
    } else if(bpmnJson.value.definitions.process.serviceTask?.attr_id === attr_id) {
        delete bpmnJson.value.definitions.process.serviceTask
    }
    if(Array.isArray(bpmnJson.value.definitions.process.userTask)) {
        const item = bpmnJson.value.definitions.process.userTask.find((item: any) => item.attr_id === attr_id)
        if (item) {
            bpmnJson.value.definitions.process.userTask = bpmnJson.value.definitions.process.userTask.filter((item: any) => item.attr_id !== attr_id)
        }
    } else if (bpmnJson.value.definitions.process.userTask?.attr_id === attr_id) {
        delete bpmnJson.value.definitions.process.userTask
    }
    if(Array.isArray(bpmnJson.value.definitions.process.exclusiveGateway)) {
        const item = bpmnJson.value.definitions.process.exclusiveGateway.find((item: any) => item.attr_id === attr_id)
        if (item) {
            bpmnJson.value.definitions.process.exclusiveGateway = bpmnJson.value.definitions.process.exclusiveGateway.filter((item: any) => item.attr_id !== attr_id)
        }
    } else if (bpmnJson.value.definitions.process.exclusiveGateway?.attr_id === attr_id) {
        delete bpmnJson.value.definitions.process.exclusiveGateway
    }

    if(Array.isArray(bpmnJson.value.definitions.process.scriptTask)) {
        const item = bpmnJson.value.definitions.process.scriptTask.find((item: any) => item.attr_id === attr_id)
        if (item) {
            bpmnJson.value.definitions.process.scriptTask = bpmnJson.value.definitions.process.scriptTask.filter((item: any) => item.attr_id !== attr_id)
        }
    } else if (bpmnJson.value.definitions.process.scriptTask?.attr_id === attr_id) {
        delete bpmnJson.value.definitions.process.scriptTask
    }
    if(Array.isArray(bpmnJson.value.definitions.process.boundaryEvent)) {
        const item = bpmnJson.value.definitions.process.boundaryEvent.find((item: any) => item.attr_id === attr_id)
        if (item) {
            bpmnJson.value.definitions.process.boundaryEvent = bpmnJson.value.definitions.process.boundaryEvent.filter((item: any) => item.attr_id !== attr_id)
        }
    } else if (bpmnJson.value.definitions.process.boundaryEvent?.attr_id === attr_id) {
        delete bpmnJson.value.definitions.process.boundaryEvent
    }
}