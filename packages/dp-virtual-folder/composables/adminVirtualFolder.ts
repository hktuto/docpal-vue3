import {getAdminVirtualFolder, removeAdminVirtualFolderById} from "dp-api";


export const useAdminVirtualFolder = () => {
    
    const list = useState<any[]>('virtualFolderList',() =>([]))
    
    async function getAdminList()  {
        list.value = await getAdminVirtualFolder();
    }
    
    async function removeItem(id:string) {
        if(!id) return;
        await removeAdminVirtualFolderById(id);
        await  getAdminList()
    }
    
    onMounted(() => {
        if(list.value.length === 0) {
            getAdminList()
        }
    })
    
    return {
        getAdminList,
        removeItem,
        list
    }
}