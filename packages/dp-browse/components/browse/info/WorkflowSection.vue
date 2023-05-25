<template>
    <div class="infoSection vertical-top">
      <div class="infoTitle">
        {{ $t('workflow_workflow') }}
      </div>
      <div class="infoContetn">
        <div class="block">
          <el-button v-if="canAdhoc" type="primary" size="small" @click="dialogShow = true">{{ $t('workflow_startAdhocWorkflow') }}</el-button>

          <template v-if="canApproval">
            <el-button type="primary" size="mini" :loading="loading" @click="handelAudit(true)">{{ $t('workflow_startAdhocWorkflow_approve') }}</el-button>
            <el-button type="danger" size="mini" :loading="loading" @click="handelAudit(false)">{{ $t('workflow_startAdhocWorkflow_reject') }}</el-button>
          </template>
        </div>
        <small>{{ displayStatus }}</small>   
      </div>

    <el-dialog :title="$t('workflow_startAdhocWorkflow')" v-model="dialogShow" append-to-body v-loading="loading">
        <el-form :model="form" ref="FormRef" @submit.native.prevent>
          <el-form-item :label="$t('role.auditor')">
            <el-select v-model="form.user_approver_id" multiple filterable clearable>
              <el-option v-for="item in userListFilter" :key="item.userId" :label="item.userId" :value="item.userId" ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogShow = false">{{$t('dpButtom_cancel')}}</el-button>
          <el-button type="primary" @click="handleStart">{{$t('dpButtom_confirm')}}</el-button>
        </div>
      </el-dialog>
      
    <!-- <template> -->

  </div> 

</template>

<script lang="ts" setup>
import {getAdHocHistory, canApprovalAdhocApi, startAdhocApi, auditAdhocApi }from 'dp-api'
import { ElMessage } from 'element-plus'
const props = defineProps<{ doc: any}>()
const { doc } = toRefs(props)
const userId:string = useUser().getUserId()
const {t} = useI18n()
const loading = ref(false)
 const adHocHistory = ref<any>();
    const adHocHistoryList = ref<any>([]);
    const {formatDate} = useTime()

    const canAdhoc = computed( () => {
      if(!adHocHistory.value) return true;
      return adHocHistory.value.approvedBy;
      // if(adHocHistory.value[0])
    });

    const displayStatus = computed(() => {
      if(!adHocHistory.value) return t('tip.noAdhoc');
      if(adHocHistory.value.approvedBy) {
        return `${adHocHistory.value.approvedBy} ${tagTextFilter(adHocHistory.value.documentStatus)} on ${t('info_version')}: ${adHocHistory.value.documentApprovalVersion} `
      }else{
        return `${adHocHistory.value.user_creator_id} submit on ${formatDate(adHocHistory.value.startTime)}, version: ${adHocHistory.value.documentStartVersion} `
      }
    })

    // #region module: befor audit
    // TODO : add method to get UserList
    const { userList, getUserList } = useUser();
    // const { userList } = toRefs(UseUser()) TODO : 
    const userListFilter = computed(() => {
      if (!userList) return []
      return userList.value.filter(item => item.userId !== userId)
    })
    // const canAdhoc = ref(false)
    const dialogShow = ref(false)
    const form = ref({
      user_approver_id: []
    })

    async function checkAdhocStatus(){
      console.log("checkAdhocStatus")
       await new Promise(resolve => setTimeout(resolve, 1000));
       const { entryList: list }= await getAdHocHistory(props.doc.id);

       adHocHistoryList.value = list.length > 0 ? list : [];
       adHocHistory.value = list.length > 0 ? list[0] : null;
    }
    const FormRef = ref()

    function handleStart () {
      FormRef.value.validate(async (valid:boolean) => {
        if(valid) {
          const param = {
            processKey: "adhocApproval",
            businessKey: `adhoc-${props.doc.name}`,
            properties: {
              documentId: props.doc.id,
              user_creator_id: userId,
              user_approver_id: form.value.user_approver_id.join(',')
            }
          }
          loading.value = true
          // TODO : add api
          await startAdhocApi(param)
          loading.value = false
          dialogShow.value = false
          FormRef.value.resetFields()
          // TODO : add api
          await checkAdhocStatus();
        }
      })
    }
    // #endregion

    // #region module: audit
      const canApproval = ref(false)

      async function handelAudit (approved:boolean) {
        if (!!approved && props.doc.isCheckedOut) {

          ElMessage.error(`${t('dpTip_versoionError')}`)
          return
        }
        const param = {
          properties: {
            documentId: props.doc.id,
            userId: userId,
            approved
          }
        }
        loading.value = true
        const res = await auditAdhocApi(param)
        loading.value = false
        if(res) {
          canApproval.value = false
          // 有延迟
          // TODO : add api
          await checkAdhocStatus();
        }
      }
    // #endregion

    // #region module: Collapse
      const collapseItems = ref(['1'])
      function tagStatusFilter (status:number) {
        switch (status) {
          case 0:
            return ''
            break
          case 1:
            return 'success'
            break
          case 2:
            return 'danger'
            break
        }
      }
      function tagTextFilter (status:number) {
        switch (status) {
          case 0:
            return t('status.underApproval')
          case 1:
            return t('status.approve')
          case 2:
            return t('status.reject')
        }
      }
    // #endregion
    // doc
    watch(doc, async(newValue) => {
        // TODO : add api
      await checkAdhocStatus()
      canApproval.value = await canApprovalAdhocApi(newValue.id, (userId) )
    }, { immediate: true })

    onMounted(() => getUserList())
</script>