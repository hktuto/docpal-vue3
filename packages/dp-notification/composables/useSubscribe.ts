// @ts-ignore

import {subscribeListGetApi, fileSubscribeApi, fileUnsubscribeApi} from 'dp-api'

export const useSubscribe = () => {

    const subscribeList = useState('subscribeList', () => []);

    // @ts-ignore
    const { user } = useUser();
    async function getSubscribeList() {
        subscribeList.value = await subscribeListGetApi(user.value.username || user.value.userId);
    }

    function isSubscribe(folderId:string) {
        return subscribeList.value.find(item => item === folderId);
    }

    async function subscribe(folderId:string) {
        await fileSubscribeApi(folderId, user.value.username || user.value.userId);
        await getSubscribeList()
    }

    async function unSubscribe(folderId:string) {
        await fileUnsubscribeApi(folderId, user.value.username || user.value.userId)
        await getSubscribeList()
    }

    async function toggleSubscribe(folderId:string) {

        if (isSubscribe(folderId)) {
            await unSubscribe(folderId)
        } else {
            await subscribe(folderId)
        }
    }


    onMounted( async() => {
        await getSubscribeList();
    })

    return {
        toggleSubscribe,
        subscribeList,
        isSubscribe
    }
}