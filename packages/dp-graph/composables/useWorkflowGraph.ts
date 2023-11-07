


export const useWorkflowGraph = () => {
    
    const graphJson = useState('graphJson')
    const bpmnJson = useState('bpmnJson');
    
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
            const formItem = getForm(startEvent);
            formItem.forEach(item => {
                form[item.attr_id] = item;
            })
        }
        // userTask form
        const userTask = Array.isArray(process?.userTask) ? process?.userTask : [process?.userTask];
        userTask.forEach(item => {
            const formItem = getForm(item);
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

    function getForm(item):any[] {
        if(item.extensionElements){
            const form = item.extensionElements['flowable:formProperty'];
            if(form){
                return form;
            }
        }
        return [];
    }
    

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

    function nameChanged(rule: any, value: any, callback: any) {
        console.log('nameChanged', value)
        if (!value) {
            return callback(new Error('Please input Name'))
        }
        const formArray = Object.keys(allFormField.value.form).map((key) => allFormField.value.form[key]);
        const isDuplicatedItem = formArray.filter((item:any) => item.attr_name === value)
        if(isDuplicatedItem && isDuplicatedItem.length > 1) {
            return callback(new Error('Name is duplicated'))
        }
    }

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
        // static
        formTypeOptions,
        // methods
        idChanged,
        nameChanged,
        newNameChanged
    }

}