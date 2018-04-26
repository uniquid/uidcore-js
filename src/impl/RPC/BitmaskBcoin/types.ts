import { IdAddress } from '../../../types/data/Identity'

export type Nonce = string
export interface RequestBody {
  method: Method
  params: Params
  id: Nonce
}
export interface Request {
  sender: IdAddress
  body: RequestBody
}
export interface ResponseBody {
  id: Nonce
  result: Result
  error: Error
}
export interface Response {
  sender: IdAddress
  body: ResponseBody
}
export type Handler = (params: Params) => Promise<Result> | Result
export type Method = number
export type Params = string
export type Result = string
export type Error = number
