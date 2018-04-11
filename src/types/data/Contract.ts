import { ProviderContract } from './Contract'
import { AbstractIdentity, IdAddress, Role } from './Identity'
export interface AbstractContract {
  received: number
  contractor: IdAddress
}

export interface AbstractRoleContract<R extends Role> extends AbstractContract {
  identity: AbstractIdentity<R>
  revoker: IdAddress
  payload: string
  revoked: number | null
}

export interface ProviderContract extends AbstractRoleContract<Role.Provider> {
  // nextProviderAddress: IdAddress
}

export interface UserContract extends AbstractRoleContract<Role.User> {}

export interface ImprintingContract extends AbstractContract {
  imprinting: true
  imprintingAddress: IdAddress
}

export interface OrchestrationContract extends ProviderContract {
  orchestration: true
}
export type RoleContract = UserContract | ProviderContract
export type Contract = RoleContract | ImprintingContract | OrchestrationContract
