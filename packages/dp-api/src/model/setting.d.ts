export type OCR_SETTING = {
    defaultOCRLanguage:string,
    supportedInputFormats: string[]
  }

  type ServerLanguageResponse = {
    locale:[
        {
            code : string,
            language : string
        }
    ]
  }