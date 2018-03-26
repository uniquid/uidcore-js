import { AbstractIdentity, IdAddress, Role } from './Identity'
export interface AbstractContract {
  received: number
  contractor: IdAddress
}

export interface RoleContract<R extends Role> extends AbstractContract {
  identity: AbstractIdentity<R>
  revoker: IdAddress
  payload: string
}

export interface ImprintingContract extends AbstractContract {
  imprinting: true
}

export interface OrchestrationContract extends RoleContract<Role.Provider> {
  orchestration: true
}

export type Contract = RoleContract<Role> | ImprintingContract | OrchestrationContract
