import { AbstractIdentity, IdAddress, Role } from './Identity'
export interface AbstractContract {
  received: number
  contractor: IdAddress
}

export interface Contract<R extends Role> extends AbstractContract {
  identity: AbstractIdentity<R>
  revoker: IdAddress
  payload: string
}

export interface ImprintingContract extends AbstractContract {
  imprinting: true
}

export interface OrchestrationContract extends Contract<Role.Provider> {
  orchestration: true
}
