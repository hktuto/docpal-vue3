import {BPMNJSON, getFormItems} from "dp-bpmn";


export const useWorkflowGraph = () => {
    
    const graphJson = useState('graphJson')
    const bpmnJson = useState<BPMNJSON>('bpmnJson');
    
    const formTypeOptions = [
        {label:"String", value:"string"},
        {label:"Date", value:'date'},
    ]
    
    const allFormField = computed(() => {
        const process = bpmnJson.value?.definitions?.process;
        const form:any = {};
        // startEvent form
        const startEvent = process?.startEvent;
        if(startEvent){
            const formItem = getFormItems(startEvent);
            formItem.forEach(item => {
                form[item.attr_id] = item;
            })
        }
        // userTask form
        const userTask = Array.isArray(process?.userTask) ? process?.userTask : [process?.userTask];
        userTask.forEach(item => {
            const formItem = getFormItems(item);
            formItem.forEach(item => {
                form[item.attr_id] = item;
            })
        })
        return {
            attr_name: process?.attr_name,
            attr_id: process?.attr_id,
            ['attr_flowable:candidateStarterGroups']: process?.['attr_flowable:candidateStarterGroups'],
            form
        }
    })

    const allFormFieldArray = computed(() => {
        return Object.keys(allFormField.value.form).map((key) => allFormField.value.form[key]);
    })

    


    /**
     * Form vaidation for id
     *
     * @param {any} rule - the rule object
     * @param {any} value - the new value of the id
     * @param {any} callback - the callback function to handle errors
     */
    function idChanged(rule: any, value: any, callback: any) {
        if (!value) {
            return callback(new Error('Please input id'))
        }
        const formArray = Object.keys(allFormField.value.form).map((key) => allFormField.value.form[key]);
        const isDuplicatedItem = formArray.filter((item:any) => item.attr_id === value)
        if(isDuplicatedItem && isDuplicatedItem.length > 1) {
            return callback(new Error('Id is duplicated'))
        }
    }

    /**
     * Form vaidation for name
     *
     * @param {any} rule - the rule object
     * @param {any} value - the new value of the id
     * @param {any} callback - the callback function to handle errors
     */
    function nameChanged(rule: any, value: any, callback: any) {
        if (!value) {
            return callback(new Error('Please input Name'))
        }
        const formArray = Object.keys(allFormField.value.form).map((key) => allFormField.value.form[key]);
        const isDuplicatedItem = formArray.filter((item:any) => item.attr_name === value)
        if(isDuplicatedItem && isDuplicatedItem.length > 1) {
            return callback(new Error('Name is duplicated'))
        }
    }

    /**
     * Form vaidation for new form item name
     *
     * @param {any} rule - the rule object
     * @param {any} value - the new value of the id
     * @param {any} callback - the callback function to handle errors
     */
    function newNameChanged(rule: any, value: any, callback: any) {
        if (!value) {
            return callback(new Error('Please input Name'))
        }
        const formArray = Object.keys(allFormField.value.form).map((key) => allFormField.value.form[key]);
        const isDuplicatedItem = formArray.some((item:any) => item.attr_name === value)
        if(isDuplicatedItem ) {
            return callback(new Error('Name is duplicated'))
        }
    }

    
    

    return {
        // data
        graphJson,
        bpmnJson,
        allFormField,
        allFormFieldArray,
        // static
        formTypeOptions,
        // methods
        idChanged,
        nameChanged,
        newNameChanged
    }

}