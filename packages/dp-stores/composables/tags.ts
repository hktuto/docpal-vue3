import { GetAllTags } from "dp-api";


export const useTags = () => {

    const tags = useState<string[]>('tags', () => []);



    onMounted(async () => {
        // if tags is empty, fetch tags from server
        if (tags.value.length === 0) {
            tags.value = await GetAllTags();
        }
    })
    
    return {

    }
}
