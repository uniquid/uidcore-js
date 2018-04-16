import { AbstractIdentity, IdAddress, Role } from '../../../types/data/Identity'

export interface RequestBody<Nonce extends string> {
  method: Method
  params: Params
  id: Nonce
}
export interface Request<Nonce extends string> {
  sender: IdAddress
  body: RequestBody<Nonce>
}
export interface ResponseBody<Nonce extends string> {
  id: Nonce
  result: Result
  error: Error
}
export interface Response<Nonce extends string> {
  sender: IdAddress
  body: ResponseBody<Nonce>
}
export type Handler = (identity: AbstractIdentity<Role.Provider>, params: Params) => Promise<Result> | Result
export type Method = number
export type Params = string
export type Result = string
export type Error = string
