export type Content = {
  valueString: string
  valueNumber: number | string,
  content: string,
  boundingRegions: {pageNumber: number, polygon: number[]}[],
  confidence?: number,
  spans: {offset: number, length: number}[],
}

export type ObjectValue = {
  type: "object",
  valueObject: {
    [key: string]: Content
  }
}
export type Field = Content &{
  type: "string" | "array",
  valueArray: ObjectValue[],
}

export type Document = {
  docType: string,
  boundingRegions: {pageNumber: number, polygon: number[]}[],
  fields: {
    [key: string]: Field
  }
}
