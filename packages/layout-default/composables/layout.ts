import {useBreakpoints} from "@vueuse/core";

type AppSlot = {
  name: string,
  order: number,
  component: any
}
enum pageFeatures {
  DOC_COMMENT = 'DOC_COMMENT',
  SUBSCRIBE = 'SUBSCRIBE',
  UPLOAD_REQUEST = 'UPLOAD_REQUEST',
  DOC_PRINT = 'DOC_PRINT',
  BULK_IMPORT = 'BULK_IMPORT',
  DAM_FILE_CONVERTION = 'DAM_FILE_CONVERTION',
  SEARCH_EXPORT = 'SEARCH_EXPORT',
  DOC_ANNOTATION = 'DOC_ANNOTATION',
  GENERATE_TEMPLATE = 'GENERATE_TEMPLATE',
  WATERMARK = 'WATERMARK',
  WORKFLOW_ADHOC = 'WORKFLOW_ADHOC',
  SHARE_EXTERNAL = 'SHARE_EXTERNAL',
  HOLD_POLICIES = 'HOLD_POLICIES',
  RETENTION_POLICIES = 'RETENTION_POLICIES',
}
export const useLayout = () => {
  const { getLicenseFeatures } = useAppStore()
  const globalSlots = useState<AppSlot[]>('globalSlots', () => shallowRef<AppSlot[]>([]))
  const headerSlots = useState<AppSlot[]>('headerSlots', () => shallowRef<AppSlot[]>([]))
  const breakpoints = useBreakpoints({
    mobile: 640,
    laptop: 1024,
    desktop: 1280,
  })
  const isMobile = breakpoints.smallerOrEqual('laptop');
  const isSmallMobile = breakpoints.smallerOrEqual('mobile');


  function allowFeature(f: pageFeatures) {

    const feature = getLicenseFeatures()
    if(!pageFeatures[f] || !feature || !feature[pageFeatures[f]]) return false
    // if(f === 'DOC_COMMENT') return false
    // if(f === 'DOC_ANNOTATION') return false
    // if(f === 'WORKFLOW_ADHOC') return false
    // if(f === 'WATERMARK') return false
    // @ts-ignore
    return feature[pageFeatures[f]]
  }
  return {
    isSmallMobile,
    globalSlots,
    headerSlots,
    isMobile,
    allowFeature
  }
}
