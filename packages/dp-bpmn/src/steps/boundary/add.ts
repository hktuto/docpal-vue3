import {BoundaryEvent, BPMNJSON, ServiceTask} from "../../types";
import {Ref} from "vue-demi";

export const addBoundaryTask = (bpmnJson:Ref<BPMNJSON>, data:ServiceTask, targetId:string) => {
    const newId = 'sid-boundary-' + new Date().getTime();
    const newTask:BoundaryEvent = {
        attr_attachedToRef: targetId,
        attr_cancelActivity:true,
        attr_id: newId,
        timerEventDefinition:{
            timeDuration: 'P3D'
        }
    }
    // check bpmnJson boundary is array
    if (Array.isArray(bpmnJson.value.definitions.process.boundaryEvent)) {
        bpmnJson.value.definitions.process.boundaryEvent.push(newTask)
        // Boundary is an array
    } else {
        bpmnJson.value.definitions.process.boundaryEvent = [bpmnJson.value.definitions.process.boundaryEvent,newTask]
        // Boundary is not an array
    }
    // add sequence flow
    bpmnJson.value.definitions.process.sequenceFlow.push({
        attr_id: 'sid-seq-' + new Date().getTime(),
        attr_sourceRef: newId,
        attr_targetRef: data.attr_id
    })
}