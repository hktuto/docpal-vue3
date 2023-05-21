export type  MenuItem = {
    name: string,
    routeName: string,
    url?: string,
    icon: string,
    role?: string[],
    public?: boolean,
    order: number,
}

declare module '@nuxt/schema' {
    interface AppConfigInput {
      menu?: MenuItem[],
      pageSetting?: any,
      feature?: {
        darkMode: boolean,
        multiLanguage: boolean,
        notification: boolean,
        userAuth : boolean,
      },
      appMenu:[] // set apps display menu
    }
  }