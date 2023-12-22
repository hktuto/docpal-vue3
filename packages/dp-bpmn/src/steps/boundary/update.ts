import {Ref} from "vue-demi";
import {BPMNJSON} from "../../types";


export const boundaryDataUpdate = (bpmnJson:Ref<BPMNJSON>, data:any) => {
    if(data){
        // found boundary envent
        if(Array.isArray(bpmnJson.value.definitions.process.boundaryEvent)){
            const item = bpmnJson.value.definitions.process.boundaryEvent.find(item => item.attr_id === data.attr_id);
            if(item){
                item.timerEventDefinition.timeDuration = data.timerEventDefinition.timeDuration;
            }
        }else{
            bpmnJson.value.definitions.process.boundaryEvent.timerEventDefinition.timeDuration = data.timerEventDefinition.timeDuration;
        }
    }
}