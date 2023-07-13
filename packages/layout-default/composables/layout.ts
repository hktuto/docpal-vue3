import {useBreakpoints} from "@vueuse/core";

type AppSlot = {
  name: string,
  order: number,
  component: any
}
export const useLayout = () => {
  const globalSlots = useState<AppSlot[]>('globalSlots', () => ([]))
  const breakpoints = useBreakpoints({
    mobile: 640,
    laptop: 1024,
    desktop: 1280,
  })
  const isMobile = breakpoints.smallerOrEqual('laptop');
  const isSmallMobile = breakpoints.smallerOrEqual('mobile');
  return {
    isSmallMobile,
    globalSlots,
    isMobile
  }
}
