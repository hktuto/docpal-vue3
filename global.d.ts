export type  MenuItem = {
    name?: string,
    url?: string,
    icon: string,
    role?: string[],
    public?: boolean,
}

declare module '@nuxt/schema' {
    interface AppConfigInput {
      menu?: MenuItem[],
      pageSetting?: any,
      feature?: {
        [key: string] : boolean
      }
    }
  }