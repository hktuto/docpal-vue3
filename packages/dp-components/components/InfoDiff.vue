

<template>
    <CodeDiff v-if="newVersion"
            :old-string="oldValue"
            :new-string="newValue"
            :file-name="newVersion.name"
            output-format="side-by-side"
            isShowNoChange></CodeDiff>
</template>

<script lang="ts" setup>
const props = defineProps<{
    newVersion: Object,
    oldVersion: Object
}>()
  const { displayTime } = useTime()

    const oldValue = ref('') // \n换行
    const newValue = ref('')
    const displayInfo = [
      { label: 'Name', key: 'name' },
      { label: 'Version', key: 'version' },
      // { label: 'Created By', key: 'createdBy' },
      { label: 'Modified Date', key: 'modifiedDate' },
      { label: 'Contributors', key: 'contributors'}
    ]

    function handleData () {
      oldValue.value = ''
      newValue.value = ''
      newValue.value = handleDoc(props.newVersion)
      oldValue.value = handleDoc(props.oldVersion)
    } 
    function handleDoc (doc):string {
      let result = "";
      doc.version = versionGet(doc)
      doc.modifiedDate = displayTime(doc.modifiedDate)
      doc.contributors = doc.properties['dc:contributors'] ? doc.properties['dc:contributors'].join(',') : ""
      displayInfo.forEach((item: any) => {
        result +=  `${item.label}：${doc[item.key]}\n`
      })
      return result;
    }

    function versionGet (doc) {
      const major_version = doc?.properties?.['uid:major_version'] || 0
      const minor_version = doc?.properties?.['uid:minor_version'] || 0
      const plus = doc.isCheckedOut ? '+' : ''
      return major_version + '.' + minor_version + plus
    }

    defineExpose({
      handleData
    })
</script>