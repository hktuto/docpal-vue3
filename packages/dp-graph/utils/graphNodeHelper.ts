
import { ElNotification} from 'element-plus'
import {BPMNJSON} from "dp-bpmn";
import {Ref} from "vue-demi";





export const  canCreateNewStep = (stepId:string, bpmnJson: Ref<BPMNJSON>) => {
    if(stepId === 'end') {
        // show error
        ElNotification.error({
            title: 'Error',
            message: 'Can not create new step at the end',
        })
        throw new Error("can't create new step")
    }
    console.log(stepId)
    // const nextStep = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_sourceRef === stepId)
    // if(nextStep){
    //     // show error
    //     ElNotification.error({
    //         title: 'Error',
    //         message: 'New Step can only be created at the end of the workflow',
    //     })
    //     throw new Error("can't create new step")
    // }
}