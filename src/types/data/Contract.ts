import { ProviderContract } from './Contract'
import { AbstractIdentity, IdAddress, Role } from './Identity'
export interface AbstractContract {
  received: number
  contractor: IdAddress
}
export type Payload = number[]
export interface AbstractRoleContract<R extends Role> extends AbstractContract {
  identity: AbstractIdentity<R>
  revoker: IdAddress
  payload: Payload
  revoked: number | null
}

export interface ProviderContract extends AbstractRoleContract<Role.Provider> {
  // nextProviderAddress: IdAddress
}

export interface UserContract extends AbstractRoleContract<Role.User> {
  providerName: string | null
}

export interface ImprintingContract extends ProviderContract {
  imprinting: true
}

export interface OrchestrationContract extends ProviderContract {
  orchestration: true
}
export type RoleContract = UserContract | ProviderContract
export type Contract = RoleContract | ImprintingContract | OrchestrationContract
