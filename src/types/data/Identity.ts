export type IdAddress = string
export type IdIndex = number
export enum Role {
  Provider = 'PROVIDER',
  User = 'USER'
}
export interface AbstractIdentity<R extends Role> {
  role: R
  index: number
}
export interface Identity<R extends Role> extends AbstractIdentity<R> {
  address: IdAddress
}
