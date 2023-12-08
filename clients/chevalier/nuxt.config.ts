import playgroundConfig from "../../utils/playgroundConfig";
import { customLayer } from "./packageManage";

const config = defineNuxtConfig({
  ssr:false,

  // color mode setting
  extends: [
    "../../apps/client"
  ],
})


export default config
