import { ImprintingContract, OrchestrationContract, RoleContract } from '../data/Contract'
import { AbstractIdentity, IdAddress, Role } from '../data/Identity'

export interface DB {
  storeImprinting(ctr: ImprintingContract): void
  getImprinting(): ImprintingContract | void
  // invalidateImprinting(): Promise<void>
  storeOrchestration(ctr: OrchestrationContract): void
  getOrchestration(): OrchestrationContract | void
  storeCtr(ctr: RoleContract): void
  getLastUserContractIdentity(): AbstractIdentity<Role.User>
  getLastProviderContractIdentity(): AbstractIdentity<Role.Provider>
  getActiveRoleContracts(): RoleContract[]
  revokeContract(revoker: IdAddress): void
  getPayload(abstrId: AbstractIdentity<Role>): RoleContract['payload']
}
