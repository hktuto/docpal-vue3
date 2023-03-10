import { ElMessage } from 'element-plus';
export const copy  = (data:any, msg = 'common_copySuccess') => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.value = data
    input.focus()
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
    ElMessage(msg as string)
}