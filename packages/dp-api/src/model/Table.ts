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
    pageSize?: number,
    notEdit?: boolean
}
export type TableColumnItem = {
    id?: string | any,
    property?: string,
    label?: string,
    sortable?:boolean,
    slot ?: string,
    headerSlot ?: string,
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
    suffixIcon?: string,
    defaultColumn?: boolean
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
    CLIENT_SMART_FOLDER_LIST = 'clientSmartFolderList',
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
    CLIENT_SHARE_SET = 'clientShareSet',
    CLIENT_FOLDER_CABINET = 'clientFolderCabinet',
    CLIENT_INTERNAL_SHEAR_ME = 'clientInternalShareMe',
    CLIENT_INTERNAL_SHEAR_OTHER = 'clientInternalShareOther',
    CLIENT_HOLD_POLICIES = "clientHoldPolicies",
    CLIENT_RETENTION_DONE = "clientRetentionDone",
    CLIENT_RETENTION_PENDING= "clientRetentionPending",
    CLIENT_DASHBOARD = 'clientDashboard',
    CLIENT_UPLOAD_AI = 'clientUploadAi',

    PUBLIC_SHARE = 'publicShare',
    ADMIN_LOG_MANAGE = 'adminLogManage',
    ADMIN_USER_MANAGE = 'adminUserManage',
    ADMIN_USER_GROUP_MANAGE = 'adminUserGroupManage',
    ADMIN_GROUP_MANAGE = 'adminGroupManage',
    ADMIN_GROUP_USER_MANAGE = 'adminGroupUserManage',
    ADMIN_META_MANAGE = 'adminMetaManage',
    ADMIN_META_DISPLAY = 'adminMetaDisplay',
    ADMIN_META_RELATED = 'adminMetaRelated',
    ADMIN_BULK_IMPORT = 'adminBulkImport',
    ADMIN_BULK_IMPORT_META = 'adminBulkImportMeta',
    ADMIN_BULK_IMPORT_CONFIG = 'adminBulkImportConfig',
    ADMIN_BULK_IMPORT_CONFIG_FORM = 'adminBulkImportConfigForm',
    ADMIN_DAM = 'adminDam',
    ADMIN_SCHEMA_LIST = 'adminSchemaList',
    ADMIN_SCHEMA_FIELDS_FORM = 'adminSchemaFieldsForm',
    ADMIN_DOC_TYPE_LIST = 'adminDocTypeList',
    ADMIN_VOCABULARY_SIMPLE_FORM = 'adminVocabularySimpleForm',
    ADMIN_VOCABULARY_CHILD_FORM = 'adminVocabularyChildForm',
    ADMIN_VOCABULARY_TREE_FORM = 'adminVocabularyTreeForm',
    ADMIN_WORKFLOW_MANAGE = 'adminWorkflowManage',
    ADMIN_WORKFLOW_EDITOR_MANAGE = 'adminWorkflowEditorManage',
    ADMIN_MESSAGE_QUEUE = 'adminMessageQueue',
    ADMIN_AUDIT = 'adminAudit',
    ADMIN_INTERNAL_SHEAR = 'adminInternalShare',

    PUBLIC_LANGUAGE_SET = 'publicLanguageSet',
    ADMIN_FOLDER_CABINET = 'adminFolderCabinet',
    ADMIN_HOLD_POLICIES_MANAGE = 'adminHoldPoliciesManage',
    ADMIN_RETENTION_MANAGE = 'adminRetentionManage',
    ADMIN_EMAIL_TEMPLATE = 'adminEmailTemplate',
    ADMIN_EMAIL_LAYOUT = 'adminEmailLayout',
    ADMIN_DOC_TEMPLATE = 'adminDocTemplate',
    ADMIN_DASHBOARD = 'adminDashboard',
    ADMIN_SMART_FOLDER = 'adminSmartFolder',
    ADMIN_MASTER_TABLE = 'adminMasterTable',
    ADMIN_META_VALIDATION = 'adminMetaValidation'
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
            { slot: 'action', property: 'action', label: 'dpTable_actions', class: "slotTopRight", }
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
            { property: 'name', label: 'tableHeader_name' }
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
            { slot: 'action', property: 'action', label: 'table_actions', class: "slotTopRight", }
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
            { label: 'dpTable_actions', slot: 'action', property: 'action', class: "slotTopRight", }
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
    [TABLE.CLIENT_SMART_FOLDER_LIST] : {
        columns: [
            { id: '1', label: 'table_name', prop: 'name' },
            { id: '2', label: 'dpDocument_fileType', slot: 'fileType' },
            {
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "preview",
                        "suffixIcon": "/icons/eye.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
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
    [TABLE.CLIENT_UPLOAD_AI] : {
        columns: [
            { id: '1', label: 'dpTable_createdDate', prop: "createdDate", formatList: [
                {
                    "joiner": "",
                    "prop": "createdDate",
                    "formatFun": "dateFormat",
                    "params": {
                        "format": ""
                    },
                    "index": 0
                }]
            },
            { id: '2', label: 'tableHeader_filesCount', prop: 'filesCount' },
            { id: '3', label: 'common_status', prop: 'uploadStatus', slot: 'status' },
            { id: '4', label: 'dpTable_actions', slot: 'commonActions', width: 100 }
        ],
        events: [],
        slots: [
            { label: 'common_status', prop: 'uploadStatus', slot: 'status' },
            { label: 'dpTable_actions', slot: 'commonActions' }
        ],
        options: { pageSize: 20 }
    },
    
    [TABLE.CLIENT_TRASH] : {
        columns: [
            { id: '6', type: 'selection' },
            { id: '7', slot: 'docIcon', label: 'tableHeader_name', defaultColumn: true },
            // { id: '1', label: 'tableHeader_name', prop: 'name' },
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
            {
                id: '7',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "delete",
                        "suffixIcon": "/icons/delete.svg",
                        "index": 0
                    },
                    {
                        "name": "",
                        "type": "text",
                        "command": "restored",
                        "suffixIcon": "/icons/restored.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['delete', 'restored'],
        slots: [
            { slot: 'docIcon', label: '' },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_COLLECTION] : {
        columns: [
            { id: '1', label: 'table_name', prop: 'name', defaultColumn: true },
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
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
            // { id: '4', type: 'selection' },
            { id: '1', slot: 'docName', label: 'table_name', prop: 'name', sortable: true, headerSlot:"nameFilter", defaultColumn: true },
           
            { id: '2', label: 'table_modifiedDate', prop: 'modifiedDate', sortable: true, 
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
            { id: '3', label: 'info_type', prop: 'documentType', sortable: true,
                formatList: [
                    {
                        "joiner": "",
                        "prop": "documentType",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ],
            },
            { id: '7', slot: 'mimeType', label: 'docInfo.fileExtension' },
            { id: '4', slot: 'tags', label: 'rightDetail_tags', prop: 'tags', sortable: true },
            { id: '5', slot: 'contributors', label: 'info_contributors', prop: 'contributors', sortable: true },
            {
                id: '6',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "rightClick",
                        "suffixIcon": "/icons/dots.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: [],
        slots: [
            { slot: 'docName', label: 'table_name', prop: 'name' },
            { slot: 'tags', label: 'rightDetail_tags', prop: 'tags' },
            { slot: 'contributors', label: 'info_contributors', prop: 'contributors' }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_SHARE_SET] : {
        columns: [
            // { id: '1', type: 'selection' },
            // { id: '4', type: 'selection' },
            { id: '2', label: 'table_name', prop: 'name', defaultColumn: true },
            { id: 'watermark', slot: 'watermark', label: 'watermark.watermark' },
            { id: '5', slot: 'readOnly', label: 'button.readOnly' },
            { id: '4', label: 'table_modifiedDate', prop: 'modifiedDate', 
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
            {
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                "prop": "",
                class: "slotTopRight",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
        slots: [
            { slot: 'watermark', label: 'watermark' }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_FOLDER_CABINET]: {
        columns: [
            { id: '7', label: 'tableHeader_status', slot: 'status',width: 60, defaultColumn: true },
            { id: '1', label: 'tableHeader_name', prop: 'label' },
            { id: '2', label: 'tableHeader_modifiedDate', prop: 'modifiedDate',
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
            { id: '3', label: 'role.creator', prop: 'createdBy' },
            { id: '6', label: 'deadline', prop: 'deadline',
                formatList: [
                    {
                        joiner: "",
                        prop: 'deadline',
                        formatFun: "dateFormat",
                        params: {
                            "format": ""
                        },
                        index: 0
                    }
                ]
            },
            { id: '4', label: 'tableHeader_type', prop: 'documentType',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "documentType",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ]
            },
            {
                "id": '5',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "goRoute",
                        "suffixIcon": "/icons/file/position.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        slots: [
            { label: 'tableHeader_status', slot: 'status' },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_SHARE_LIST] : {
        columns: [
            { id: '1', label: 'tableHeader_emailList', prop: 'emailList', defaultColumn: true, 
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
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
    [TABLE.CLIENT_INTERNAL_SHEAR_ME] : {
        columns: [
            { id: '1', slot: 'docIcon', label: 'tableHeader_name', prop: 'documentName', defaultColumn: true },
            // { id: '2', label: 'tableHeader_name', prop: 'documentName'},
            { id: '3', label: 'tableHeader_shareBy', prop: 'shareByUserId' },
            { id: '4', label: 'tableHeader_shareDate', prop: 'createdDate', 
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
            },
            {
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "preview",
                        "suffixIcon": "/icons/eye.svg",
                        "index": 0
                    },
                    {
                        "name": "",
                        "type": "text",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        slots: [
            { slot: 'docIcon' },
        ],
        events: ['preview'],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_INTERNAL_SHEAR_OTHER] : {
        columns: [
            { id: '1', slot: 'docIcon', label: 'tableHeader_name', prop: 'documentName', defaultColumn: true },
            // { id: '2', label: 'tableHeader_name', prop: 'documentNames'},
            { id: '3', label: 'tableHeader_shareTo', prop: 'shareToUserIds' },
            { id: '4', label: 'tableHeader_shareDate', prop: 'createdDate', 
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
            },
            {
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "preview",
                        "suffixIcon": "/icons/eye.svg",
                        "index": 0
                    },
                    {
                        "name": "",
                        "type": "text",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        slots: [
            { slot: 'docIcon' },
        ],
        events: ['preview'],
        options: { pageSize: 20 }
    },
    
    [TABLE.CLIENT_FILE_REQUEST] : {
        columns: [
            { id: '1', label: 'dpTable_email', prop: 'email', showOverflowTooltip: true, defaultColumn: true },
            { id: '2', label: 'dpTable_location', prop: 'logicalPath', showOverflowTooltip: true },
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
            { id: '3', label: 'dpDocument_fileName', prop: 'initName', sortable: true, defaultColumn: true },
            { id: '4', label: 'dpDocument_fileType', prop: 'type', slot: 'documentType', sortable: true },
            {   
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
            { id: '3', label: 'dpDocument_fileName', prop: 'initName', sortable: true, defaultColumn: true },
            { id: '4', label: 'dpDocument_fileType', prop: 'documentType', slot: 'documentType', sortable: true,
                formatList: [
                    {
                        "joiner": "",
                        "prop": "documentType",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ]
            },
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
            { id: '1', label: 'table_name', prop: 'taskInstance.businessKey', defaultColumn: true },
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
            { id: '1', label: 'table_name', prop: 'businessKey', sortable: true, defaultColumn: true },
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
            { id: '1', label: 'table_name', prop: 'taskInstance.businessKey', defaultColumn: true },
            { id: '2', label: 'workflow_workflow', prop: 'taskInstance.processDefinitionName' },
            { id: '3', label: 'workflow_assignee', prop: 'assignee',  },
            { id: '4', label: 'workflow_createDate', prop: 'createDate', 
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
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_ADHOC_SUBMITTED_TASK] : {
        columns: [
            { id: '1', label: 'table_path', prop: 'documentPath', defaultColumn: true },
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
            { id: '1', label: 'table_path', prop: 'documentPath', defaultColumn: true },
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
            { id: '1', label: 'table_path', prop: 'documentPath', defaultColumn: true},
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
            { id: '1', label: 'tableHeader_name', prop: 'name', defaultColumn: true, sortable: true },
            { id: '2', label: 'tableHeader_path', prop: 'logicalPath', showOverflowTooltip: true },
            { id: '3', label: 'tableHeader_type', prop: 'type', sortable: true },
            { id: '6', label: 'search_authors', prop: 'createdBy', sortable: true },
            { id: '7', label: 'search_contributors', prop: 'properties.dc:contributors',
                formatList: [
                    {
                        "joiner": "",
                        "prop": 'properties.dc:contributors',
                        "formatFun": "concat",
                        "params": {
                            "joiner": ""
                        },
                        "index": 0
                    }
                ]
            },
            { id: '4',label: 'tableHeader_modifiedDate', prop: 'modifiedDate', align: 'center', width: '180', sortable: true,
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
    [TABLE.CLIENT_HOLD_POLICIES]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'documentName', defaultColumn: true },
            { id: '2', label: 'tableHeader_path', prop: 'documentPath' },
            { id: '3', label: 'tableHeader_policyName', prop: 'policyHoldName' },
            { id: '4', label: 'tableHeader_applyBy', prop: 'applyBy' },
            { id: '5', label: 'tableHeader_approver', prop: 'applyApprovedBy' },
            { id: '6', label: 'tableHeader_confirmAt', prop: 'applyApprovedDate',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "applyApprovedDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]
            },
            {   
                id: '7',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "goRoute",
                        "suffixIcon": "/icons/file/position.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['delete'],
        slots: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_RETENTION_DONE]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'documentName', defaultColumn: true },
            { id: '2', label: 'tableHeader_path', prop: 'documentPath' },
            { id: '3', label: 'tableHeader_policyName', prop: 'policyName' },
            { id: '4', label: 'tableHeader_approver', slot: 'approver', width: 150 },
            { id: '6', label: 'tableHeader_confirmAt', slot: 'confirmAt', width: 150},
        ],
        events: [],
        slots: [
            { label: 'tableHeader_approver', slot: 'approver', width: 150 },
            { label: 'tableHeader_confirmAt', slot: 'confirmAt', width: 150 }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_RETENTION_PENDING]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'documentName', defaultColumn: true },
            { id: '2', label: 'tableHeader_path', prop: 'documentPath' },
            { id: '3', label: 'tableHeader_policyName', prop: 'policyName' },
            // { id: '4', label: 'tableHeader_approver', prop: 'approver' },
            { id: '4', label: 'tableHeader_dueDate', prop: 'expireDate', width: 150,
                formatList: [
                    {
                        "joiner": "",
                        "prop": "expireDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]
            },
            { id: '5', slot: 'action', label: 'tableHeader_actions', width: 100, align: 'center' }
        ],
        events: [],
        slots: [
            { slot: 'action', label: 'tableHeader_actions', width: 100, align: 'center' }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_DASHBOARD]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            // { id: '3', label: 'role.creator', prop: 'createdBy'},
            { id: '4', label: 'workflow_createDate', prop: 'createdDate', 
                width: 150,
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
        events: ['delete', 'edit'],
        slots: [
        ],
        options: { pageSize: 20 }
    },
    
    [TABLE.PUBLIC_SHARE]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'title', defaultColumn: true },
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
            { id: '4', slot: 'actions', label: 'tableHeader_actions', class: "slotTopRight", }
            // {   
            //     id: '4',
            //     "type": "buttons",
            //     "label": "tableHeader_actions",
            //     "prop": "",
            //     "align": "left",
            //     "hide": false,
            //     "system": false,
            //     "showOverflowTooltip": false,
            //     "formatList": [],
            //     "buttons": [
            //         {
            //             "name": "download",
            //             "command": "download",
            //             "type": "primary",
            //             "index": 0
            //         }
            //     ],
            //     "prefixIcon": "",
            //     "suffixIcon": "",
            // }
        ],
        slots: [
            { slot: 'actions', label: 'tableHeader_actions', class: "slotTopRight", }
        ],
        events: ['download'],
        options: { pageSize: 20 }
    },

    [TABLE.ADMIN_LOG_MANAGE]: {
        columns: [
            { id: '1', label: 'service', prop: 'service', defaultColumn: true },
            { id: '2', label: 'effectiveLevel', prop: 'effectiveLevel' },
            { id: '3', label: 'configuredLevel', prop: 'configuredLevel', slot: 'configuredLevel' }
        ],
        events: [],
        slots: [
            { slot: 'configuredLevel', label: 'configuredLevel', prop: 'configuredLevel' },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_USER_MANAGE]: {
        columns: [
            { id: '1', label: 'username', prop: 'username', "width": 200, showOverflowTooltip: true, defaultColumn: true  },
            // { id: '2', label: 'Identifer', prop: 'userId' },
            { id: '3', label: 'user_email', prop: 'email', "width": 250, showOverflowTooltip: true  },
            { id: '4', label: 'user_groupName', slot: 'group' },
            { id: '5', label: 'user_active', slot: 'active', "width": 100 },
            {   
                id: '6',
                "label": "tableHeader_actions",
                "width": 100,
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "preview",
                        "suffixIcon": "/icons/eye.svg",
                        "index": 0
                    }
                ],
            }
        ],

        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_USER_GROUP_MANAGE]: {
        columns: [
            { id: '1', label: 'user_groupName', prop: 'name', defaultColumn: true },
            { id: '2', label: 'user_groupIdentifer', prop: 'id' },
            {   
                id: '3',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
    [TABLE.ADMIN_GROUP_MANAGE]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name', defaultColumn: true },
            { id: '2', label: 'Identifer', prop: 'id' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_GROUP_USER_MANAGE]: {
        columns: [
            { id: '1', label: 'username', prop: 'username', defaultColumn: true },
            { id: '2', label: 'user_groupIdentifer', prop: 'userId' },
            {   
                id: '3',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_META_MANAGE]: {
        columns: [
            { id: '1', slot: 'icon', label: '', width: 50 },
            { id: '2', label: 'docType_documentType', prop: 'documentType', width: 200, showOverflowTooltip: true, defaultColumn: true,
                formatList: [
                    {
                        "joiner": "",
                        "prop": "documentType",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ]
            },
            { id: '3', slot: 'displayMeta', label: 'docType_displayMeta' },
            { id: '4', slot: 'relatedDocument', label: 'docType_relatedDocument' },
        ],
        events: [],
        slots: [
            { slot: 'icon', width: 50 },
            { slot: 'displayMeta', label: 'docType_displayMeta' },
            { slot: 'relatedDocument', label: 'docType_relatedDocument' },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_META_VALIDATION]: {
        columns: [
            { id: '1', slot: 'icon', label: '', width: 50 },
            { id: '2', label: 'docType_documentType', prop: 'name', showOverflowTooltip: true, defaultColumn: true, sortable: true },
            { id: '3', label: 'doc.isFolder', prop: 'isFolder', width: 200, sortable: true },
            {   
                id: '4',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "edit",
                        "suffixIcon": "/icons/edit.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            },
        ],
        events: [],
        slots: [
            { slot: 'icon', width: 50 },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_META_DISPLAY]: {
        columns: [
            { id: '1', label: 'rightDetail_meta', prop: 'metaData', showOverflowTooltip: true, defaultColumn: true, sortable: true },
            // { id: '2', label: 'form_vocabulary', prop: 'vocabulary', showOverflowTooltip: true },
            // { id: '3', label: 'form_length', prop: 'length'},
            { id: '3', label: 'metadata.dataType', prop: 'dataType', slot: 'dataType', width: 150, sortable: true},
            { id: '4', slot: 'isRequire', label:'form_isRequire', width: 120, sortable: true },
            { id: '5', slot: 'display',label:'form_display', prop: 'display',width: 110, sortable: true },
            {   
                id: '6',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
        slots: [
            { label: 'dataType', prop: 'dataType', slot: 'dataType'},
            { slot: 'isRequire', label:'form_isRequire', width: 50 },
            { slot: 'display', label:'form_display', width: 50 },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_META_RELATED]: {
        columns: [
            { id: '1', label: 'dpTable_documentType', prop: 'documentType', defaultColumn: true, sortable: true,
                formatList: [
                    {
                        "joiner": "",
                        "prop": "documentType",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ]
            },
            { id: '2', label: 'rightDetail_meta', prop: 'metaData', sortable: true },
            {   
                id: '3',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
    [TABLE.ADMIN_BULK_IMPORT]: {
        columns: [
            { id: '1', slot: 'icon', label: '', width: 50 },
            { id: '2', label: 'docType_documentType', prop: 'documentType', width: 200, showOverflowTooltip: true, defaultColumn: true,
                formatList: [
                    {
                        "joiner": "",
                        "prop": "documentType",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ]
            },
            { id: '3', slot: 'metaMapping', label: 'docType_metaMapping' },
            { id: '4', slot: 'bulkImportConfig', label: 'docType_captureProfile' },
        ],
        events: [],
        slots: [
            { slot: 'icon', width: 50 },
            { slot: 'metaMapping', label: 'docType_metaMapping' },
            { slot: 'bulkImportConfig', label: 'docType_captureProfile' },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_BULK_IMPORT_META]: {
        columns: [
            { id: '1', label: 'docType_property', prop: 'metaData', showOverflowTooltip: true, defaultColumn: true,
                formatList: [
                    {
                        "joiner": "",
                        "prop": "metaData",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ]
            },
            { id: '2', label: 'table_label', prop: 'label', showOverflowTooltip: true },
            {   
                id: '3',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_BULK_IMPORT_CONFIG]: {
        columns: [
            { id: '1', label: 'dpTable_id', prop: 'profileID', defaultColumn: true },
            { id: '2', label: 'dpTable_name', prop: 'profileName' },
            {   
                id: '3',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_BULK_IMPORT_CONFIG_FORM]: {
        columns: [
            { id: '1', prop: 'title', label: 'title', defaultColumn: true },
            { id: '2', prop: 'name', label: 'tableHeader_name' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_DAM]: {
        columns: [
            { id: '2', label: 'DAM_fileType', prop: 'sourceType', width: 200, showOverflowTooltip: true, defaultColumn: true },
            { id: '3', slot: 'targetTypes', label: 'DAM_convertion' },
            {   
                id: '4',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "add",
                        "suffixIcon": "/icons/add.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['add'],
        slots: [
            { slot: 'targetTypes', label: 'DAM_convertion' },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_SCHEMA_LIST]: {
        columns: [
            { id: '1', prop: 'keyword', label: 'tableHeader_name', defaultColumn: true},
            {   
                id: '2',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "edit",
                        "suffixIcon": "/icons/edit.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_DOC_TYPE_LIST]: {
        columns: [
            { id: '1', prop: 'docTypeId', label: 'tableHeader_name', defaultColumn: true },
            {   
                id: '2',
                "type": "",
                "label": "tableHeader_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "edit",
                        "suffixIcon": "/icons/edit.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_SCHEMA_FIELDS_FORM]: {
        columns: [
            { id: '1', prop: 'id', label: 'docType_id' },
            { id: '2', prop: 'label', label: 'docType_label', defaultColumn: true },
            { id: '3', slot: 'type', label: 'docType_type', prop: 'type' },
            // { id: '4', slot: 'setting' },
            { id: '5', prop: 'defaultValue', label: 'docType_defaultValue' },
            { id: '6', slot: 'multiple', label: 'multiple', prop: 'isMultiValue', headerAlign: 'center', align: 'center',width: 80, defaultValue: false }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_VOCABULARY_SIMPLE_FORM]: {
        columns: [
            { id: '1', slot: 'id', prop: 'id', label: 'docType_id' },
            { id: '2', prop: 'label', label: 'docType_label', defaultColumn: true },
            { id: '3', slot: 'obsolete', label: 'obsolete', prop: 'obsolete', headerAlign: 'center', align: 'center',width: 80, defaultValue: false },
            { id: '4', prop: 'order', label: 'order', defaultValue: 0 }
        ],
        events: [],
        slots: [
            { slot: 'id', prop: 'id', label: 'docType_id' },
            { slot: 'obsolete', label: 'obsolete', prop: 'obsolete', headerAlign: 'center', align: 'center',width: 80, defaultValue: false }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_VOCABULARY_CHILD_FORM]: {
        columns: [
            { id: '1', prop: 'id', label: 'docType_id' },
            { id: '2', prop: 'label', label: 'docType_label', defaultColumn: true },
            { id: '3', slot: 'parentEntryID', prop: 'parentEntryID', label: 'parentEntryID' },
            
            { id: '4', slot: 'obsolete', label: 'obsolete', prop: 'obsolete', headerAlign: 'center', align: 'center',width: 80, defaultValue: false },
            { id: '5', prop: 'order', label: 'order', defaultValue: 0 }
        ],
        events: [],
        slots: [
            { slot: 'id', prop: 'id', label: 'docType_id' },
            { slot: 'parentEntryID', prop: 'parentEntryID', label: 'parentEntryID' },
            { slot: 'obsolete', label: 'obsolete', prop: 'obsolete', headerAlign: 'center', align: 'center',width: 80, defaultValue: false }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_VOCABULARY_TREE_FORM]: {
        columns: [
            { id: '1', slot: 'id', prop: 'id', label: 'docType_id' },
            { id: '2', prop: 'label', label: 'docType_label', defaultColumn: true },
            { id: '3', slot: 'obsolete', label: 'obsolete', prop: 'obsolete', headerAlign: 'center', align: 'center',width: 80, defaultValue: false },
            { id: '4', prop: 'order', label: 'order', defaultValue: 0 }
        ],
        events: [],
        slots: [
            { slot: 'id', prop: 'id', label: 'docType_id' },
            { slot: 'obsolete', label: 'obsolete', prop: 'obsolete', headerAlign: 'center', align: 'center',width: 80, defaultValue: false }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_WORKFLOW_MANAGE]: {
        columns: [
            { id: '1', type: 'selection' },
            { id: '2', label: 'table_name', prop: 'taskInstance.businessKey', defaultColumn: true },
            { id: '3', label: 'workflow_workflow', prop: 'taskInstance.processDefinitionName' },
            { id: '4', label: 'role.creator', prop: 'taskInstance.startUserId' },
            { id: '5', label: 'workflow_assignee', prop: 'assignee' },
            { id: '6', label: 'workflow_createDate', prop: 'createDate',
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
            { id: '7', label: 'workflow_dueDate', prop: 'dueDate',
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
            {   
                id: '8',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    },
                    {
                        "name": "",
                        "type": "text",
                        "command": "reallocate",
                        "suffixIcon": "/icons/allocate.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['delete', 'reallocate'],
        slots: [
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_WORKFLOW_EDITOR_MANAGE]: {
        columns: [
            { id: '2', label: 'table_name', prop: 'name', defaultColumn: true },
            { id: '6', label: 'workflow_createDate', prop: 'createdDate',
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
            },
            {   
                id: '8',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "edit",
                        "suffixIcon": "/icons/edit.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['delete', 'reallocate'],
        slots: [
        ],
        options: { pageSize: 20 }
    },
    
    [TABLE.ADMIN_MESSAGE_QUEUE]: {
        columns: [
            { id: '2', label: 'table_fileName', prop: 'fileName', defaultColumn: true },
            { id: '3', label: 'table_path', prop: 'logicalPath', showOverflowTooltip: true },
            { id: '4', label: 'category', prop: 'category' },
            { id: '5', label: 'dpTable_status', prop: 'status' },
            { id: '6', label: 'table_last_update', prop: 'lastUpdateDate',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "lastUpdateDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]  
            },
            { id: '7', slot: 'refreshAction', label: 'dpTable_actions', class: "slotTopRight", },
        ],
        events: [],
        slots: [
            { slot: 'refreshAction', label: 'dpTable_actions', class: "slotTopRight", },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_INTERNAL_SHEAR] : {
        columns: [
            { id: '1', slot: 'docIcon', label: 'tableHeader_name', prop: 'documentName', defaultColumn: true },
            // { id: '1', label: 'tableHeader_name', prop: 'documentName'},
            { id: '2', label: 'tableHeader_shareBy', prop: 'shareByUserId' },
            { id: '3', label: 'tableHeader_shareTo', prop: 'shareToUserIds',},
            { id: '4', label: 'tableHeader_shareDate', prop: 'createdDate', 
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
            },
            {
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    // {
                    //     "name": "",
                    //     "type": "text",
                    //     "command": "preview",
                    //     "suffixIcon": "/icons/eye.svg",
                    //     "index": 0
                    // },
                    {
                        "name": "",
                        "type": "text",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        slots: [
            { slot: 'docIcon' },
        ],
        events: ['preview'],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_AUDIT]: {
        columns: [
            { id: '1', label: 'User', prop: 'principalName', defaultColumn: true },
            { id: '2', slot: 'currentPath', label: 'table_path', prop: 'currentPath', showOverflowTooltip: true },
            { id: '3', label: 'category', prop: 'eventCategory' },
            { id: '4', label: 'Event', prop: 'eventId',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "eventId",
                        "formatFun": "i18n",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]  
            },
            { id: '5', label: 'Date', prop: 'eventDate',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "eventDate",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]  
            },
        ],
        events: ['goClientPath'],
        slots: [
            { slot: 'currentPath', label: 'table_path', prop: 'currentPath', showOverflowTooltip: true }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.PUBLIC_LANGUAGE_SET]: {
        columns: [
            { id: '1', label: 'key', prop: 'key', defaultColumn: true, copy: true },
            { id: '2', label: 'en-US', prop: 'en-US', slot: 'enUS' },
            { id: '3', label: 'zh-CN', prop: 'zh-CN', slot: 'zhCN' },
            { id: '4', label: 'zh-HK', prop: 'zh-HK', slot: 'zhHK' },
            { id: '5', label: 'dpTable_actions', slot: 'actions', class: "slotTopRight", }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_FOLDER_CABINET]: {
        columns: [
            { id: '1', label: 'folderCabinet.name', prop: 'label', defaultColumn: true },
            { id: '2', label: 'docType_documentType', prop: 'documentType',
                formatList: [
                    {
                        "joiner": "",
                        "prop": "documentType",
                        "formatFun": "i18n",
                        "params": {
                        },
                        "index": 0
                    }
                ]
            },
            {   
                id: '3',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
        slots: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_HOLD_POLICIES_MANAGE]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'policyName', defaultColumn: true },
            { id: '3', label: 'role.creator', prop: 'createdBy' },
            { id: '4', label: 'workflow_createDate', prop: 'createdDate', 
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
            },
            { id: '2', label: 'user_active', slot: 'active', prop: 'status', width: 100 },
            {   
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
        slots: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_DOC_TEMPLATE]: {
        columns: [
            { id: '10', label: '', slot: 'iconName', defaultColumn: true, width: 60 },
            { id: '1', label: 'tableHeader_name', prop: 'name', defaultColumn: true },
            { id: '2', label: 'info_type', prop: 'fileType' },
            { id: '3', label: 'role.creator', prop: 'createdBy' },
            { id: '4', label: 'workflow_createDate', prop: 'createdDate', 
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
            },
            { id: '2', label: 'dpTable_actions', slot: 'templateAction', prop: 'status', width: 100 },
        ],
        events: ['delete'],
        slots: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_RETENTION_MANAGE]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'policyName', defaultColumn: true },
            { id: '2', label: 'docType_documentType', slot: 'docType' },
            { id: '3', label: 'rp.period', prop: 'periodNum', slot: 'period'},
            { id: '4', label: 'workflow_createDate', prop: 'createdDate', 
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
            },
            { id: '5', label: 'rp.isAuto', slot: 'isAuto', prop: 'isAuto', width: 150, align: 'center' },
            { id: '6', label: 'user_active', slot: 'active', prop: 'status', width: 100 },
            {   
                id: '7',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
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
        slots: [
            { label: 'docType_documentType', slot: 'docType' },
            { label: 'user_active', slot: 'active', prop: 'status', width: 100 },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_EMAIL_TEMPLATE]: {
        columns: [
            {id: "0", label:"tableHeader_name", prop:"label"},
            { id: '1', label: 'tableHeader_subject', prop: 'subject' },
            { id: '2', label: 'ID', prop: 'id', copy: true },
            { id: '3', label: 'emailTemplate.layout', prop: 'emailLayoutName' },
            { id: '4', label: 'role.creator', prop: 'createdBy', width: 100 },
            { id: '5', label: 'dpTable_actions', slot: 'emailAction', "width": 100 },
            // { id: '4', label: 'workflow_createDate', prop: 'createdDate', 
            //     formatList: [
            //         {
            //             "joiner": "",
            //             "prop": "createdDate",
            //             "formatFun": "dateFormat",
            //             "params": {
            //                 "format": ""
            //             },
            //             "index": 0
            //         }
            //     ]
            // },
            
        ],
        events: ['delete'],
        slots: [
            { label: 'dpTable_actions', slot: 'emailAction' },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_EMAIL_LAYOUT]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '3', label: 'role.creator', prop: 'createdBy'},
            { id: '4', label: 'workflow_createDate', prop: 'createdDate', 
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
            },
            {   
                id: '7',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "edit",
                        "suffixIcon": "/icons/edit.svg",
                        "index": 0
                    },
                    {
                        "name": "",
                        "type": "text",
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
        slots: [
            { label: 'docType_documentType', slot: 'docType' },
            { label: 'user_active', slot: 'active', prop: 'status', width: 100 },
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_DASHBOARD]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '2', label: 'tableHeader_access', prop: 'access' },
            // { id: '3', label: 'role.creator', prop: 'createdBy'},
            { id: '4', label: 'workflow_createDate', prop: 'createdDate', 
                width: 150,
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
            },
            {   
                id: '7',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "edit",
                        "suffixIcon": "/icons/edit.svg",
                        "index": 0
                    },
                    {
                        "name": "",
                        "type": "text",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['delete', 'edit'],
        slots: [
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_MASTER_TABLE]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '2', label: 'role.creator', prop: 'createdBy'},
            { id: '3', label: "dpTable_actions", slot: 'more', width: 100}
        ],
        events: ['delete', 'edit', 'preview', 'more'],
        slots: [
            { label: "dpTable_actions", slot: 'more', width: 100 }
        ],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_SMART_FOLDER]: {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '2', label: 'tableHeader_access', prop: 'userGroups', 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "userGroups",
                        "formatFun": "concat",
                        "params": {
                            "joiner": ""
                        },
                        "index": 0
                    }
                ] 
            },
            {   
                id: '7',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "edit",
                        "suffixIcon": "/icons/edit.svg",
                        "index": 0
                    },
                    {
                        "name": "",
                        "type": "text",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['delete', 'edit'],
        slots: [
        ],
        options: { pageSize: 20 }
    }
    
    
}

export function TableAddColumns (columnItem: TableColumnItem, columnList: any, position: number = 1) {
    const _columnItem: TableColumnItem = {
        ...columnItem,
        showOverflowTooltip: true
    }
    if (columnItem.type === 'date') {
        _columnItem.formatList = [
            {
                joiner: "",
                prop: columnItem.prop,
                formatFun: "dateFormat",
                params: {
                    "format": ""
                },
                index: 0
            }
        ]
    } else if (columnItem.type === 'complex') {
        _columnItem.formatList = [
            {
                joiner: "",
                prop: columnItem.prop,
                formatFun: "concat",
                params: {
                    "format": ""
                },
                index: 0
            }
        ]
    }
    columnList.splice(position, 0, {
        ..._columnItem
    })
    return columnList
} 

export function TableAddMultiColumns (columnItems: TableColumnItem[], columnList: any, position: number = 1) {
    const resultList = structuredClone(columnList)
    const columns = columnItems.reduce((prev: any, item:TableColumnItem) => {
        const _columnItem: TableColumnItem = {
            label: item.label,
            prop: item.prop,
            id: item.id,
            formatList: item.formatList ? item.formatList : [],
            showOverflowTooltip: true
        }
        if (item.type === 'date') {
            _columnItem.formatList = [
                {
                    joiner: "",
                    prop: item.prop,
                    formatFun: "dateFormat",
                    params: {
                        "format": ""
                    },
                    index: 0
                }
            ]
        } else if (item.type === 'complex') {
            _columnItem.formatList = [
                {
                    joiner: "",
                    prop: item.prop,
                    formatFun: "concat",
                    params: {
                        "format": ""
                    },
                    index: 0
                }
            ]
        } else if (item.type === 'size') {
            _columnItem.formatList = [
                {
                    "joiner": "",
                    "prop": item.prop,
                    "formatFun": "fileSize",
                    "params": {
                        "joiner": ""
                    },
                    "index": 0
                }
            ]
        }
        prev.push(_columnItem)
        return prev
    }, [])
    resultList.splice(position, 0, ...columns)
    return resultList
} 
