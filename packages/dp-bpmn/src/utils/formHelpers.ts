import {BpmnFormField, StartEvent, UserTask} from "../types";


/**
 * Retrieves the form items from the given step 
 * Only step with extensionElements is supported
 *
 * @param {StartEvent | UserTask} item - The item to retrieve the form items from.
 * @return {BpmnFormField[]} An array of form items.
 */
export const getFormItems =(item: StartEvent | UserTask):BpmnFormField[] => {
    if(item.extensionElements){
        const form = item.extensionElements['flowable:formProperty'];
        if(form){
            return form;
        }
    }
    return [];
}