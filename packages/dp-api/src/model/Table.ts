export type TableColumnSetting = {
    [key:string] : TableColumnItem[]
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
    canNotDelete ?:boolean
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
    ACTIVE_TASK = 'activeTask'
}

export const defaultSetting: TableColumnSetting = {
    [TABLE.ALL_TASK] : [
        { id:1, label: 'table_name', property: 'taskName', sortable: true },
        { id:2, label: 'workflow_workflow', property: 'processDefinitionName', sortable: true, isFilter: true },
        { id:3, slot: 'status', property: 'status', label: 'common_status' },
        { id:4, slot: 'assignee', property: 'assignee', label: 'workflow_assignee' },
        { id:5, label: 'workflow_createDate', property: 'createDate', sortable: true },
        { id:6, label: 'workflow_dueDate', property: 'dueDate', sortable: true },
    ],
    [TABLE.META_CAPTURE_PROFILE]: [
        { label: 'dpTable_id', property: 'profileID', sortable: true },
        { label: 'dpTable_name', property: 'profileName' },
        { slot: 'action', property: 'action', label: 'dpTable_actions' }
    ],
    [TABLE.META_IMPORT_MAPPING] :[
        { label: 'docType_property', property: 'key', sortable: true },
        { label: 'table_label', property: 'label' },
        { slot: 'action', property: 'action', label: 'table.action' }
    ],
    [TABLE.META_PROFILE_DIALOG] :[
        { property: 'title', label: 'title' },
        { property: 'name', label: 'name' }
    ],
    [TABLE.META_LIST] : [
        { slot: 'icon' },
        { label: 'docType_documentType', property: 'name', sortable: true },
        { slot: 'metaMapping', label: 'docType_metaMapping' },
        { slot: 'metaProfile', label: 'docType_metaMapping', },
    ],
    [TABLE.META_DISPLAY_LIST] : [
        { label: 'docType_property', property: 'metaData', sortable: true },
        { label: 'form_vocabulary', property: 'vocabulary' },
        { label: 'form_length', property: 'length', align: 'right', width: '100' },
        { slot: 'isRequire', label: 'form_isRequire', property: 'isRequire', width: '100' },
        { slot: 'display', property: 'display', label: 'form_display' },
        { slot: 'action', property: 'action', label: 'table_action' }
    ],
    [TABLE.META_RELATED_LIST] : [
        { label: 'dpTable_documentType', property: 'type', sortable: true },
        { label: 'rightDetail_meta', property: 'meta' },
        { slot: 'action', property: 'action', label: 'table_actions' }
    ],
    [TABLE.CHILD_FORM] : [
        { property: 'id', label: 'id', slot: "id" },
        { property: 'label', label: 'dpTable_label' },
        { property: 'parentEntryID', label: 'parentEntryID', slot: "parentEntryID"},
        { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: 100, align: 'center', headerAlign: 'center', defaultValue: false },
        { property: 'order', label: 'order', defaultValue: 0 }
    ],
    [TABLE.HIERARCHIAL_FORM]:[
        { property: 'id', label: 'id', slot: "id" },
        { property: 'label', label: 'dpTable_label' },
        { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: 100, align: 'center', headerAlign: 'center', defaultValue: false },
    ],
    [TABLE.SIMPLE_FORM]:[
        { property: 'id', label: 'id', slot: "id" },
      { property: 'label', label: 'dpTable_label' },
      { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: 100, align: 'center', headerAlign: 'center', defaultValue: false },
    ],
    [TABLE.ADMIN_WORKFLOW] :[
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
    [TABLE.VERSION_POPOVER] :[
        { label: 'file_versionNumber', property: 'version', sortable: true },
        { label: 'table_lastModified', property: 'time', sortable: true },
        { slot: 'action', property: 'action', label: 'table_action' }
    ],
    [TABLE.COMPLETE_TASK] :[
        { label: 'table_name', property: 'taskName', sortable: true },
        { slot: 'workflow', label: 'workflow_workflow', property: 'workflow' },
        // { label: 'workflow_workflow', property: 'name', sortable: true },
        { label: 'workflow_createDate', property: 'createDate', sortable: true },
        { label: 'table_completeDate', property: 'completeDate', sortable: true },
        { slot: 'duration', label: 'table_duration', property: 'duration' }
    ],
    [TABLE.ACTIVE_TASK] :[
        { label: 'table_name', property: 'taskName', sortable: true },
        { slot: 'workflow', label: 'workflow_workflow', property: 'workflow' },
        { id:3, slot: 'status', property: 'status', label: 'common_status' },
        { id:4, slot: 'assignee', property: 'assignee', label: 'workflow_assignee' },
        { label: 'workflow_createDate', property: 'createDate', sortable: true },
    ],
    [TABLE.MY_TASK] :[
        { label: 'table_name', property: 'taskName', sortable: true },
        { label: 'workflow_workflow', property: 'processDefinitionName', sortable: true, isFilter: true },
        { slot: 'status', label: 'common_status', property: 'status', },
        { slot: 'assignee', label: 'workflow_assignee', property: 'assignee', },
        { label: 'workflow_createDate', property: 'createDate', sortable: true },
        { label: 'workflow_dueDate', property: 'dueDate', sortable: true },
    ],
    [TABLE.SMART_FOLDER] :[
        { slot: 'icon', property: 'isFolder' },
        { label: 'table_name', property: 'name', sortable: true },
        // { label: 'table_path', property: 'path', sortable: true },
        { label: 'table_modifiedDate', property: 'modifiedDate', sortable: true },
        { label: 'table_type', property: 'type', sortable: true },
    ],
    [TABLE.FILE_REQUEST_DETAIL] :[
        { slot: 'selection' },
        { slot: 'expand' },
        { label: 'dpDocument_fileName', property: 'initName', sortable: true },
        { slot: 'fileType', label: 'dpDocument_fileType', property: 'documentType', sortable: true },
        { slot: 'approve',label: 'dpTool_approve', property: 'approve', sortable: true, align: 'center' },
    ],
    [TABLE.FILE_REQUEST_INDEX] : [
        { label: 'dpTable_email', property: 'email', sortable: true },
        { label: 'dpTable_location', property: 'documentId', sortable: true },
        { label: 'dpTable_message', property: 'message', sortable: true },
        { label: 'dpTable_status', property: 'status', sortable: true, slot: 'status' },
        { label: 'dpTable_createdDate', property: 'createdDate', sortable: true },
    ],
    [TABLE.ADHOC_Submitted_TASK] : [
        { label: 'table_path', property: 'documentPath', sortable: true },
        // { label: 'info_version', property: 'documentStartVersion' },
        // { label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true },
        { label: 'role.approvers', property: 'user_approver_id', sortable: true, isFilter: true },
        { label: 'workflow_createDate', property: 'createDate', sortable: true },
        // { label: 'table_completeDate', property: 'completeDate', sortable: true },
        // { slot: 'duration', label: 'table_duration', property: 'duration' }
        // { label: 'table_duration', property: 'duration', align:"right", sortable: true },
    ],
    [TABLE.ADHOC_Approval_TASK] : [
        { label: 'table_path', property: 'documentPath', sortable: true },
        { label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true },
        { label: 'workflow_createDate', property: 'createDate', sortable: true },
    ],
    [TABLE.ADHOC_Completed_TASK] : [
        { label: 'table_path', property: 'documentPath', sortable: true },
        { label: 'info_version', property: 'documentApprovalVersion', align: 'right', width: 70 },
        { label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true, width: 150 },
        { label: 'workflow_createDate', property: 'createDate', sortable: true, align: 'center', width: 130 },
        { label: 'role.approver', property: 'approvedBy', sortable: true, isFilter: true, width: 150 },
        { label: 'dpTable_approvedDate', property: 'approvedDate', sortable: true, align: 'center', width: 130 },
    ]

}
export const defaultTableBaseSetting: TableBaseSetting = {
    [TABLE.ALL_TASK] : {
        commands: []
    },
    [TABLE.ALL_TASK] : {
        commands: []
    },
    [TABLE.META_CAPTURE_PROFILE]: {
        commands: []
    },
    [TABLE.META_IMPORT_MAPPING] :{
        commands: []
    },
    [TABLE.META_PROFILE_DIALOG] :{
        commands: []
    },
    [TABLE.META_LIST] : {
        commands: []
    },
    [TABLE.META_DISPLAY_LIST] : {
        commands: []
    },
    [TABLE.META_RELATED_LIST] : {
        commands: []
    },
    [TABLE.CHILD_FORM] : {
        commands: []
    },
    [TABLE.HIERARCHIAL_FORM]:{
        commands: []
    },
    [TABLE.SIMPLE_FORM]:{
        commands: []
    },
    [TABLE.ADMIN_WORKFLOW] :{
        commands: []
    },
    [TABLE.VERSION_POPOVER] :{
        commands: []
    },
    [TABLE.COMPLETE_TASK] :{
        commands: []
    },
    [TABLE.ACTIVE_TASK] :{
        commands: []
    },
    [TABLE.MY_TASK] :{
        commands: []
    },
    [TABLE.SMART_FOLDER] :{
        commands: []
    },
    [TABLE.FILE_REQUEST_DETAIL] :{
        commands: []
    },
    [TABLE.FILE_REQUEST_INDEX] : {
        commands: []
    },
    [TABLE.ADHOC_Submitted_TASK] : {
        commands: []
    },
    [TABLE.ADHOC_Approval_TASK] : {
        commands: []
    },
    [TABLE.ADHOC_Completed_TASK] : {
        commands: []
    },
    [TABLE.ADHOC_Completed_TASK] : {
        commands: []
    },
    [TABLE.CLIENT_TRASH] : {
        commands: ['delete', 'restored']
    },
    'trash' : {
        commands: ['delete', 'restored']
    }
}
