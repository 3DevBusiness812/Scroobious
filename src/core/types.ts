// Note: duplicating this type rather than importing from the api package as doing so imports a lot of the api package
export type CourseStepStatus = 'NEW' | 'COMPLETE'

export type ScroobiousSession = {
  user: {
    name: string
    email: string
    image: string
    id: string
  }
  expires: string
  apiToken: string
  impersonatingFromUserId?: string
}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type JsonPrimitive = string | number | boolean | null | {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonArray extends Array<JsonValue> {}

export type JsonObject = { [member: string]: JsonValue }

export type JSONObject = JsonObject
