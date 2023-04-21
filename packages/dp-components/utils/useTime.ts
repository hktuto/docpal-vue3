import dayjs from 'dayjs'

export const useTime = () => {
    const { t } = useI18n()
    const pickerOptions = {
        shortcuts: [{
            text: `1 ${t('common_day')}`,
            onClick(picker:any) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date, true);
            }
        }, {
            text: `7 ${t('common_days')}`,
            onClick(picker:any) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date, true);
            }
        }, {
            text: `30 ${t('common_days')}`,
            onClick(picker:any) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', date, true);
            }
        }]
    }

    const today = new Date();

    const makeDueDay = (time:string) => {
        return dayjs(time).add(3, 'day').format('YYYY-MM-DD HH:mm')
    }
    const displayTime = (time:string) => {
        return dayjs(time).format('YYYY-MM-DD HH:mm')
    }
    const formatDate = (time:string, format: string = 'YYYY-MM-DD HH:mm', isDefault:Boolean = false) => {
        const defaultTime = isDefault ? today : ''
        return time ? dayjs(time).format(format) : defaultTime
    }
    const diffDay = (date1:string | Date = today, date2:string | Date = today, isDefault:Boolean = false) => {
        if (!date1) date1 = isDefault ? today : ''
        if (!date2) date2 = isDefault ? today : ''
        return dayjs(date1).diff(date2, 'day')
    }
    const diffMinute = (date1:string | Date = today, date2:string | Date = today) => {
        return dayjs(date1).diff(date2, 'minute')
    }
    return {
        pickerOptions,
        makeDueDay,
        displayTime,
        formatDate,
        diffDay,
        diffMinute
    }
}