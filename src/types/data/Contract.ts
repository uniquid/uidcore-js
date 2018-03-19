import { IdAddress, Identity, PROVIDER, ProviderIdentity, USER, UserIdentity } from './Identity'
export interface BaseContract {
  identity: Identity
  revoker: IdAddress
  payload: string
  received: number
}
export interface ProviderContract extends BaseContract {
  user: IdAddress
  identity: ProviderIdentity
}

export interface UserContract extends BaseContract {
  provider: IdAddress
  identity: UserIdentity
}

export interface ImprintContract extends BaseContract {
  imprinter: IdAddress
  identity: ProviderIdentity
}

export interface RechargeContract extends BaseContract {
  from: IdAddress[]
  identity: ProviderIdentity
}

export interface RevokeContract extends BaseContract {
  revoker: IdAddress
  identity: UserIdentity
}

export type Contract = ImprintContract | ProviderContract | UserContract | RechargeContract | RevokeContract

export interface ContractOf {
  [PROVIDER]: ProviderIdentity
  [USER]: UserIdentity
}
