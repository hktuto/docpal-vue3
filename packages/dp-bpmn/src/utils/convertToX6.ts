import {
    BoundaryEvent,
    BPMNJSON,
    EndEvent,
    ExclusiveGateway,
    SequenceFlow,
    ServiceTask,
    StartEvent,
    UserTask
} from "../types";


export const normalizeToX6 = (bpmnJson:BPMNJSON) => {
    const process = bpmnJson.definitions.process
    const startEvent:StartEvent = process.startEvent
    const endEvent:EndEvent = process.endEvent
    const sequenceFlow = convertToArray<SequenceFlow>(process.sequenceFlow)
    const userTask = convertToArray<UserTask>(process.userTask)
    const exclusiveGateway = convertToArray<ExclusiveGateway>(process.exclusiveGateway)
    const boundaryEvent = convertToArray<BoundaryEvent>(process.boundaryEvent)
    const serviceTask = convertToArray<ServiceTask>(process.serviceTask)
    const scriptTask = convertToArray(process.scriptTask)
    return {
        startEvent,
        endEvent,
        sequenceFlow,
        userTask,
        exclusiveGateway,
        boundaryEvent,
        serviceTask,
        scriptTask
    }
}

/**
 * Convert the given step into an array. return empty array if the value is null
 *
 * @param {T} value - The value to be converted.
 * @return {T[]} The converted array.
 */
function convertToArray<T>(value:T):T[] {
    if(!value){
        return []
    }
    if(Array.isArray(value)){
        return value
    }
    return [value]
}