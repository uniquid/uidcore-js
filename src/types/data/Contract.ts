import { AbstractIdentity, IdAddress, Role } from './Identity'
export interface Contract<R extends Role> {
  identity: AbstractIdentity<R>
  revoker: IdAddress
  payload: string
  received: number
  against: IdAddress
}
