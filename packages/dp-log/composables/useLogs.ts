type UserLog = {
    time: number,
    log: any;
}

export const useLog = () => {

    const userLog = useState<UserLog[]>('UserLog', () => ([]))

    function setUserLog(...args:any) {
        const t = Date.now();
        userLog.value.push({
            time: t,
            log: [...args]
        })
    }

    function exportLogs() {
        return userLog;
    }

    return {
        setUserLog,
        exportLogs,
        userLog
    }
}