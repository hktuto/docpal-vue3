import {BPMNJSON, ExclusiveGateway, UserTask} from "../../types";
import {Ref} from "vue-demi";

export const addExclusiveGateway = (bpmnJson: Ref<BPMNJSON>, data: UserTask, targetId:string) => {
    const newId = 'sid-excl-' + new Date().getTime();
    const newTask: ExclusiveGateway = {
        attr_id: newId,
    }
    
    // check bpmnJson exclusiveGateway is array
    if (Array.isArray(bpmnJson.value.definitions.process.exclusiveGateway)) {
        bpmnJson.value.definitions.process.exclusiveGateway.push(newTask)
        // Boundary is an array
    } else {
        
        bpmnJson.value.definitions.process.exclusiveGateway = [bpmnJson.value.definitions.process.exclusiveGateway, newTask]
        // Boundary is not an array
    }
    // add sequence flow
    bpmnJson.value.definitions.process.sequenceFlow.push(
        {
            attr_id: 'sid-seq-ex-user-' + new Date().getTime(),
            attr_sourceRef: data.attr_id,
            attr_targetRef: newId
        },
        {
            attr_id: 'sid-seq-' + new Date().getTime(),
            attr_sourceRef: newId,
            attr_targetRef: targetId,
            conditionExpression: {
                'attr_xsi:type': "tFormalExpression",
                __cdata: '${approved}'
            }
        },
        {
            attr_id: 'sid-seq-' + new Date().getTime(),
            attr_sourceRef: newId,
            attr_targetRef: 'end',
            conditionExpression: {
                'attr_xsi:type': "tFormalExpression",
                __cdata: '${!approved}'
            }
        }
    )
}