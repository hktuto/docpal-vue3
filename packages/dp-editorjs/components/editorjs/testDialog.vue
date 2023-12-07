<script setup lang="ts">
  import {api} from "dp-api";
  import {useEditor} from "~/composables/useEditorjs";

  const props = defineProps<{
    options:any,
    data:any,
  }>();
  const {variables} = useEditor()
  
  const testForm = ref({
    to: '',
    templateId: props.data.id,
    variables: variables.value.reduce((acc:any, cur:any) => {
      
      if(!cur.includes(',')) {
        console.log(cur)
        acc[cur] = '';
      }else{
        const obj = cur.split(',');
        const key = obj.shift();
        
        acc[key] = [
            obj.reduce((oAcc:any, oCur:string)=>{
              oAcc[oCur.replaceAll(" ", "")] = "";
              return oAcc
            },{})
        ]
      }
      return acc;
    }, {})
  })
  
  
  async function send() {
    const body = testForm.value;
    // loop variables in body , and replace /n with <br>
    Object.keys( body.variables).forEach((key) => {
      // remove line break to <br/>
      //if body.variable[key] is string
      if(typeof body.variables[key] ==='string'){
        body.variables[key] = body.variables[key].replace(/(?:\r\n|\r|\n)/g, '<br/>');
      }
    })
    console.log(body)
    const res = await api.post('/docpal/template/email/send', body);
  }
  
  function addRow(key:string) {
    const data = {...testForm.value.variables[key][0]}
    // reset all value to empty in data
    Object.keys(data).forEach( item => {
      data[item] = ""
    })
    testForm.value.variables[key].push(data)
  }
  
  function removeRow(key:string,index:number) {
    testForm.value.variables[key].splice(index, 1);
  }
  
  defineExpose({
    send
  })
  
  
</script>

<template>
  <div class="dialogContentContainer">
    <div class="form">
        <ElForm :data="testForm" label-position="top">
          <ElFormItem label="To">
            <ElInput v-model="testForm.to"></ElInput>
          </ElFormItem>
          <template v-for="(value,key) in testForm.variables" :key="key">
            <ElFormItem v-if="typeof value === 'string'"  :label="key" :key="key">
              <ElInput type="textarea" v-model="testForm.variables[key]"></ElInput>
            </ElFormItem>
            <template v-else>
              <!--            loopable data-->
              <ElDivider></ElDivider>
              <div class="loopHeader">
                
                <div class="subTitle">{{key}}</div>
                <div class="action">
                  <SvgIcon  src="/icons/add.svg" @click="addRow(key)" />
                </div>
              </div>
              <div class="tableAction">
                <template v-for="(item,index) in value" :key="key + '-' + index">
                  <div class="form">
                    
                  <template v-for="(kValue, kKey) in item" :key="key+ index+kKey">
                    <ElFormItem :label="kKey">
                      <ElInput  v-model="testForm.variables[key][index][kKey]"></ElInput>
                    </ElFormItem>
                  </template>
                  </div>
                  <div class="action">
                    <SvgIcon v-if="index !== 0" src="/icons/close.svg" @click="removeRow(key,index)"/>
                  </div>
                </template>
              </div>
              
              <ElDivider></ElDivider>
            </template>
          </template>
          
        </ElForm>
    </div>
      
  </div>
 
</template>

<style scoped lang="scss">
.dialogContentContainer{
  
}
.loopHeader{
  width:100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  .subTitle{
    flex: 1 0 auto;
    font-size: 1.2rem;
    font-weight: bold;
  }
}
.tableAction{
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  gap: var(--app-padding);
  .form{
    display: flex;
    flex-flow: row wrap;
    gap: var(--app-padding);
    flex: 1 0 auto;
    > * {
      flex: 1 0 auto;
    }
  }
  .action{
    flex: 0 0 20px;
  }
}
</style>