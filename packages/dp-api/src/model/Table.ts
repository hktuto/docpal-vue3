// import '../../../dp-components/typing/table'
export type TableColumnSetting = {
    [key:string] : TableColumnSettingItem
}

export type TableColumnSettingItem = {
    columns: TableColumnItem[],
    events: string[],
    slots?: TableColumnItem[],
    options: TableColumnSettingOptions
}
export type TableColumnSettingOptions = {
    pageSize?: number
}
export type TableColumnItem = {
    id?: string | any,
    property?: string,
    label?: string,
    sortable?:boolean,
    slot ?: string,
    align ?: string,
    width ?: string | number,
    defaultValue ?: any,
    headerAlign ?: string,
    isFilter ?: boolean,
    canNotDelete ?:boolean,
    prop?: string,
    type?: string,
    hide?: boolean,
    system?: boolean,
    class?: string,
    showOverflowTooltip?: boolean,
    formatList?: any[],
    buttons?: any[],
    prefixIcon?: string,
    suffixIcon?: string
}
export type TableBase = {
    commands: any[]
}
export type TableBaseSetting = {
    [key:string] : TableBase
}
export enum TABLE {
    META_CAPTURE_PROFILE = "metaCaptureProfile",
    META_IMPORT_MAPPING = 'metaImportMapping',
    META_PROFILE_DIALOG = "metaProfileDialog",
    META_LIST = "metaList",
    META_DISPLAY_LIST = 'metaDisplayList',
    META_RELATED_LIST = 'metaRelatedList',
    CHILD_FORM = 'childForm',
    HIERARCHIAL_FORM = 'hierarchicalForm',
    SIMPLE_FORM = 'simpleForm',
    ADMIN_WORKFLOW = 'adminWorkflow',
    VERSION_POPOVER = 'versionPopOver',
    ALL_TASK = 'allTask',
    COMPLETE_TASK = 'completeTask',
    MY_TASK = 'myTask',
    SMART_FOLDER = 'smartFolder',
    FILE_REQUEST_DETAIL = 'fileRequestDetail',
    FILE_REQUEST_INDEX = 'fileRequestIndex',
    ADHOC_Submitted_TASK = 'adhocSubmittedTask',
    ADHOC_Approval_TASK = 'adhocApprovalTask',
    ADHOC_Completed_TASK = 'adhocCompletedTask',
    ACTIVE_TASK = 'activeTask',
    CLIENT_TRASH = 'clientTrash',
    CLIENT_SMART_FOLDER = 'clientSmartFolder',
    CLIENT_COLLECTION = 'clientCollection',
    CLIENT_SHARE_LIST = 'clientShareList',
    CLIENT_SEARCH = 'clientSearch',
    CLIENT_FILE_UPLOAD = 'clientFileUpload',
    CLIENT_FILE_REQUEST = 'clientFileRequest',
    CLIENT_FILE_REQUEST_AUDIT = 'clientFileRequestAudit',
    CLIENT_WORKFLOW_All_TASK = 'clientAllTask',
    CLIENT_WORKFLOW_MY_TASK = 'clientMyTask',
    CLIENT_WORKFLOW_COMPLETE_TASK = 'clientCompleteTask',
    CLIENT_WORKFLOW_ACTIVE_TASK = 'clientActiveTask',
    CLIENT_ADHOC_APPROVAL_TASK = 'clientAdhocApprovalTask',
    CLIENT_ADHOC_SUBMITTED_TASK = 'clientAdhocSubmittedTask',
    CLIENT_ADHOC_COMPLETED_TASK = 'clientAdhocCompletedTask',
    CLIENT_BROWSE = 'clientBrowse',

    PUBLIC_SHARE = 'publicShare',
    ADMIN_LOG_MANAGE = 'adminLogManage'
}

export const defaultTableSetting: TableColumnSetting = {
    [TABLE.ALL_TASK] : {
        columns: [
            { id:1, label: 'table_name', property: 'taskName', sortable: true },
            { id:2, label: 'workflow_workflow', property: 'processDefinitionName', sortable: true, isFilter: true },
            { id:3, slot: 'status', property: 'status', label: 'common_status' },
            { id:4, slot: 'assignee', property: 'assignee', label: 'workflow_assignee' },
            { id:5, label: 'workflow_createDate', property: 'createDate', sortable: true },
            { id:6, label: 'workflow_dueDate', property: 'dueDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_CAPTURE_PROFILE]: {
        columns: [
            { label: 'dpTable_id', property: 'profileID', sortable: true },
            { label: 'dpTable_name', property: 'profileName' },
            { slot: 'action', property: 'action', label: 'dpTable_actions' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_IMPORT_MAPPING] :{
        columns: [
            { label: 'docType_property', property: 'key', sortable: true },
            { label: 'table_label', property: 'label' },
            { slot: 'action', property: 'action', label: 'table.action' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_PROFILE_DIALOG] :{
        columns: [
            { property: 'title', label: 'title' },
            { property: 'name', label: 'name' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_LIST] : {
        columns: [
            { slot: 'icon' },
            { label: 'docType_documentType', property: 'name', sortable: true },
            { slot: 'metaMapping', label: 'docType_metaMapping' },
            { slot: 'metaProfile', label: 'docType_metaMapping', },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_DISPLAY_LIST] : {
        columns: [
            { label: 'docType_property', property: 'metaData', sortable: true },
            { label: 'form_vocabulary', property: 'vocabulary' },
            { label: 'form_length', property: 'length', align: 'right', width: '100' },
            { slot: 'isRequire', label: 'form_isRequire', property: 'isRequire', width: '100' },
            { slot: 'display', property: 'display', label: 'form_display' },
            { slot: 'action', property: 'action', label: 'table_action' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_RELATED_LIST] : {
        columns: [
            { label: 'dpTable_documentType', property: 'type', sortable: true },
            { label: 'rightDetail_meta', property: 'meta' },
            { slot: 'action', property: 'action', label: 'table_actions' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CHILD_FORM] : {
        columns: [
            { property: 'id', label: 'id', slot: "id" },
            { property: 'label', label: 'dpTable_label' },
            { property: 'parentEntryID', label: 'parentEntryID', slot: "parentEntryID"},
            { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: '100', align: 'center', headerAlign: 'center', defaultValue: false },
            { property: 'order', label: 'order', defaultValue: 0 }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.HIERARCHIAL_FORM]:{
        columns: [
            { property: 'id', label: 'id', slot: "id" },
            { property: 'label', label: 'dpTable_label' },
            { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: '100', align: 'center', headerAlign: 'center', defaultValue: false },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.SIMPLE_FORM]: {
        columns: [
            { property: 'id', label: 'id', slot: "id" },
          { property: 'label', label: 'dpTable_label' },
          { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: '100', align: 'center', headerAlign: 'center', defaultValue: false },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_WORKFLOW] : {
        columns: [
            { label: 'dpTable_selection', slot: 'selection', canNotDelete: true, },
            // { label: 'common.status', property: 'name', sortable: true, isFilter: true, type: 'tag' },
            // { slot: 'status', property: 'status', label: i18n.t('common_status') },
            { label: 'table_name', property: 'taskName', sortable: true },
            { label: 'workflow_workflow', property: 'processDefinitionName', sortable: true, isFilter: true },
            { label: 'role.creator', property: 'startUserId', sortable: true, isFilter: true },
            { label: 'workflow_assignee', slot: 'assignee', property: 'assignee' },
            // { slot: 'status', property: 'status', label: i18n.t('common_status') },
            // { slot: 'assignee', property: 'assignee', label: i18n.t('workflow_assignee')  },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
            { label: 'workflow_dueDate', property: 'dueDate', sortable: true },
            { label: 'dpTable_actions', slot: 'action', property: 'action' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.VERSION_POPOVER] : {
        columns: [
            { label: 'file_versionNumber', property: 'version', sortable: true },
            { label: 'table_lastModified', property: 'time', sortable: true },
            { slot: 'action', property: 'action', label: 'table_action' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.COMPLETE_TASK] : {
        columns: [
            { label: 'table_name', property: 'taskName', sortable: true },
            { slot: 'workflow', label: 'workflow_workflow', property: 'workflow' },
            // { label: 'workflow_workflow', property: 'name', sortable: true },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
            { label: 'table_completeDate', property: 'completeDate', sortable: true },
            { slot: 'duration', label: 'table_duration', property: 'duration' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ACTIVE_TASK] : {
        columns: [
            { label: 'table_name', property: 'taskName', sortable: true },
            { slot: 'workflow', label: 'workflow_workflow', property: 'workflow' },
            { id:3, slot: 'status', property: 'status', label: 'common_status' },
            { id:4, slot: 'assignee', property: 'assignee', label: 'workflow_assignee' },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.MY_TASK] : {
        columns: [
            { label: 'table_name', property: 'taskName', sortable: true },
            { label: 'workflow_workflow', property: 'processDefinitionName', sortable: true, isFilter: true },
            { slot: 'status', label: 'common_status', property: 'status', },
            { slot: 'assignee', label: 'workflow_assignee', property: 'assignee', },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
            { label: 'workflow_dueDate', property: 'dueDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_SMART_FOLDER] : {
        columns: [
            { id: '1', label: 'table_name', prop: 'name' },
            { id: '2', label: 'table_path', prop: 'logicalPath' },
            { id: '3', label: 'table_modifiedDate', prop: 'modifiedDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "modifiedDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
            { id: '4', label: 'table_type', prop: 'type' },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.FILE_REQUEST_DETAIL] : {
        columns: [
            { id: '1', slot: 'selection' },
            { id: '2', slot: 'expand' },
            { id: '3', label: 'dpDocument_fileName', property: 'initName', sortable: true },
            { id: '4', slot: 'fileType', label: 'dpDocument_fileType', property: 'documentType', sortable: true },
            { id: '5', slot: 'approve',label: 'dpTool_approve', property: 'approve', sortable: true, align: 'center' },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.FILE_REQUEST_INDEX] : {
        columns: [
            { label: 'dpTable_email', property: 'email', sortable: true },
            { label: 'dpTable_location', property: 'documentId', sortable: true },
            { label: 'dpTable_message', property: 'message', sortable: true },
            { label: 'dpTable_status', property: 'status', sortable: true, slot: 'status' },
            { label: 'dpTable_createdDate', property: 'createdDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADHOC_Submitted_TASK] : {
        columns: [
            { id: '1', label: 'table_path', property: 'documentPath', sortable: true },
            // { label: 'info_version', property: 'documentStartVersion' },
            // { label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true },
            { id: '2', label: 'role.approvers', property: 'user_approver_id', sortable: true, isFilter: true },
            { id: '3', label: 'workflow_createDate', property: 'createDate', sortable: true },
            // { label: 'table_completeDate', property: 'completeDate', sortable: true },
            // { slot: 'duration', label: 'table_duration', property: 'duration' }
            // { label: 'table_duration', property: 'duration', align:"right", sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADHOC_Approval_TASK] : {
        columns: [
            { id:'1', label: 'table_path', property: 'documentPath', sortable: true },
            { id:'2', label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true },
            { id:'3', label: 'workflow_createDate', property: 'createDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADHOC_Completed_TASK] : {
        columns: [
            { id: '1', label: 'table_path', property: 'documentPath', sortable: true },
            { id: '2', label: 'info_version', property: 'documentApprovalVersion', align: 'right', width: '70' },
            { id: '3', label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true, width: '150' },
            { id: '4', label: 'workflow_createDate', property: 'createDate', sortable: true, align: 'center', width: '130' },
            { id: '5', label: 'role.approver', property: 'approvedBy', sortable: true, isFilter: true, width: '150' },
            { id: '6', label: 'dpTable_approvedDate', property: 'approvedDate', sortable: true, align: 'center', width: '130' },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_TRASH] : {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '2', label: 'tableHeader_path', prop: 'logicalPath' },
            { id: '3', label: 'tableHeader_type', prop: 'type' },
            { id: '4', label: 'trash_deleteBy', prop: 'properties.principalName' },
            { id: '5', label: 'trash_date', prop: "properties.trashed_date", formatList: [
                {
                    "joiner": "",
                    "prop": "properties.trashed_date",
                    "formatFun": "dateFormat",
                    "params": {
                        "format": ""
                    },
                    "index": 0
                }]
            },
            
        ],
        events: ['delete', 'restored'],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_COLLECTION] : {
        columns: [
            { id: '1', label: 'table_name', prop: 'name' },
            { id: '2', label: 'table_modifiedDate', prop: 'modifiedDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "modifiedDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
            { id: '3', label: 'table_type', prop: 'type' },
            {   
                id: '4',
                "type": "",
                "label": "actions",
                "prop": "",
                "align": "left",
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['delete'],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_BROWSE] : {
        columns: [
            { id: '4', type: 'selection' },
            { id: '1', slot: 'docName', label: 'table_name', prop: 'name' },
            { id: '2', label: 'table_name', prop: 'name' },
            { id: '3', label: 'table_modifiedDate', prop: 'modifiedDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "modifiedDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            }
        ],
        events: [],
        slots: [
            { slot: 'docName', label: 'table_name', prop: 'name' },
            { id: '3', label: 'tableHeader_type', prop: 'type' },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_SHARE_LIST] : {
        columns: [
            { id: '1', label: 'tableHeader_emailList', prop: 'emailList', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "emailList",
                        "formatFun": "concat",
                        "params": {
                            "joiner": ""
                        },
                        "index": 0
                    }
                ] 
            },
            { id: '2', label: 'tableHeader_numberOfFiles', prop: 'documentSize' },
            { id: '3', label: 'tableHeader_creationDate', prop: 'created', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "created",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
            { id: '4', label: 'tableHeader_dueDate', prop: 'expiredDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "expiredDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
            {
                id: '5',
                "type": "",
                "label": "actions",
                "prop": "",
                "align": "left",
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "command": "disabled",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['disabled'],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_FILE_REQUEST] : {
        columns: [
            { id: '1', label: 'dpTable_email', prop: 'email', showOverflowTooltip: true },
            { id: '2', label: 'dpTable_location', prop: 'documentId', showOverflowTooltip: true },
            { id: '3', label: 'dpTable_message', prop: 'message', showOverflowTooltip: true },
            { id: '4', label: 'dpTable_status', prop: 'status',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "status",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ] 
            },
            { id: '5', label: 'dpTable_createdDate', prop: 'createdDate',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "createdDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_FILE_UPLOAD] : {
        columns: [
            { id: '1', type: 'selection' },
            { id: '2', type: 'expand', slot: 'expand' },
            { id: '3', label: 'dpDocument_fileName', prop: 'initName', sortable: true },
            { id: '4', label: 'dpDocument_fileType', prop: 'type', slot: 'documentType', sortable: true },
            {   
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                "prop": "",
                "align": "left",
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: [],
        options: { }
    },
    [TABLE.CLIENT_FILE_REQUEST_AUDIT] : {
        columns: [
            { id: '1', type: 'selection' },
            { id: '2', type: 'expand', slot: 'expand' },
            { id: '3', label: 'dpDocument_fileName', prop: 'initName', sortable: true },
            { id: '4', label: 'dpDocument_fileType', prop: 'documentType', slot: 'documentType', sortable: true },
            { id: '5', label: 'dpTool_approve', prop: 'approve', slot: 'approve', sortable: true, align: 'center' },
        ],
        events: [],
        options: { }
    },
    [TABLE.CLIENT_WORKFLOW_All_TASK] : {
        columns: [
            { id:1, label: 'table_name', prop: 'taskInstance.businessKey' },
            { id:2, label: 'workflow_workflow', prop: 'taskInstance.processDefinitionName', class: 'tag' },
            { id:3, label: 'common_status', prop: 'name', class: 'danger-tag round', showOverflowTooltip: true },
            { id:4, label: 'workflow_assignee', prop: 'assignee', type: 'slot', slot: 'assignee' },
            { id:7, label: 'workflow_startUser', prop: 'taskInstance.startUserId' },
            { id:5, label: 'workflow_createDate', prop: 'createDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "createDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]
            },
            { id:6, label: 'workflow_dueDate', prop: 'dueDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "dueDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
        ],
        events: [],
        slots: [
            { slot: 'assignee', label: 'workflow_assignee', prop: 'assignee' },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_WORKFLOW_MY_TASK] : {
        columns: [
            { id: '1', label: 'table_name', prop: 'taskInstance.businessKey' },
            { id: '2', label: 'workflow_workflow', prop: 'taskInstance.processDefinitionName'},
            { id: '3', label: 'common_status', prop: 'name', },
            { id: '4', label: 'workflow_assignee', prop: 'assignee', },
            { id: '5', label: 'workflow_createDate', prop: 'createDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "createDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]
            },
            { id: '6', label: 'workflow_dueDate', prop: 'dueDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "dueDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]
            },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_WORKFLOW_COMPLETE_TASK] : {
        columns: [
            { id: '1', label: 'table_name', prop: 'businessKey', sortable: true },
            { id: '2', label: 'workflow_workflow', prop: 'processDefinitionName' },
            // { label: 'workflow_workflow', property: 'name', sortable: true },
            { id: '3', label: 'workflow_createDate', prop: 'createDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "startTime",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]
            },
            { id: '4', label: 'table_completeDate', prop: 'completeDate', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "endTime",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
            { id: '5', label: 'table_duration', prop: 'duration', align: 'right',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "endTime",
                        "formatFun": "duration",
                        "params": {
                            "date": "startTime"
                        },
                        "index": 0
                    }
                ] 
            }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_WORKFLOW_ACTIVE_TASK] : {
        columns: [
            { id: '1', label: 'table_name', prop: 'businessKey' },
            { id: '2', label: 'workflow_workflow', prop: 'processDefinitionName' },
            { id: '3', label: 'workflow_assignee', prop: 'name',  },
            { id: '4', label: 'workflow_createDate', prop: 'startTime', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "startTime",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_ADHOC_SUBMITTED_TASK] : {
        columns: [
            { id: '1', label: 'table_path', prop: 'documentPath' },
            { id: '2', label: 'role.approvers', prop: 'user_approver_id' },
            { id: '3', label: 'workflow_createDate', prop: 'startTime',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "startTime",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_ADHOC_APPROVAL_TASK] : {
        columns: [
            { id: '1', label: 'table_path', prop: 'documentPath' },
            { id: '2', label: 'role.creator', prop: 'user_creator_id' },
            { id: '3', label: 'workflow_createDate', prop: 'startTime',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "startTime",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_ADHOC_COMPLETED_TASK] : {
        columns: [
            { id: '1', label: 'table_path', prop: 'documentPath'},
            { id: '2', label: 'info_version', prop: 'documentApprovalVersion', align: 'right', width: '80' },
            { id: '3', label: 'role.creator', prop: 'user_creator_id', width: '150' },
            { id: '4', label: 'workflow_createDate', prop: 'startTime', align: 'center', width: '180',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "startTime",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]  
            },
            { id: '5', label: 'role.approver', prop: 'approvedBy', width: '150' },
            { id: '6', label: 'dpTable_approvedDate', prop: 'approvedDate', align: 'center', width: '150',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "approvedDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]  
            },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_SEARCH] : {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '2', label: 'tableHeader_path', prop: 'logicalPath' },
            { id: '3', label: 'tableHeader_type', prop: 'type' },
            { id: '4',label: 'tableHeader_modifiedDate', prop: 'modifiedDate', align: 'center', width: '180',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "modifiedDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]  
            },
            { id: '5', slot: 'tags', label: 'dpTable_tags', prop: 'tags' },
        ],
        events: [],
        slots: [
            { slot: 'tags', label: 'dpTable_tags', prop: 'tags' },
        ],
        options: { pageSize: 20 }
    },


    [TABLE.PUBLIC_SHARE]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'title' },
            { id: '2', label: 'tableHeader_modifiedDate', prop: 'lastModified',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "lastModified",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ] 
            },
            { id: '3', label: 'tableHeader_type', prop: 'type' },
            {   
                id: '4',
                "type": "buttons",
                "label": "tableHeader_actions",
                "prop": "",
                "align": "left",
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "download",
                        "command": "download",
                        "type": "primary",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['download'],
        options: { pageSize: 20 }
    },

    [TABLE.ADMIN_LOG_MANAGE]: {
        columns: [
            { id: '1', label: 'service', prop: 'service' },
            { id: '2', label: 'effectiveLevel', prop: 'effectiveLevel' },
            { id: '3', label: 'configuredLevel', prop: 'configuredLevel', slot: 'configuredLevel' }
        ],
        events: [],
        slots: [
            { slot: 'configuredLevel', label: 'configuredLevel', prop: 'configuredLevel' },
        ],
        options: { pageSize: 20 }
    }
}
