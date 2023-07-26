
type SlotData = {
    name: string,
    order: number,
    component: any
}
export const useBrowse = () => {
    const infoSlots = useState<SlotData[]>('infoSlots', () => ([]));

    return {
        infoSlots
    }
}