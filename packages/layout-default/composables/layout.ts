
type AppSlot = {
  name: string,
  order: number,
  component: any
}
export const useLayout = () => {
  const globalSlots = useState<AppSlot[]>('globalSlots', () => ([]))

  return {
    globalSlots
  }
}
