import { ImprintingContract, OrchestrationContract, RoleContract } from '../data/Contract'
import { AbstractIdentity, Role } from '../data/Identity'

export interface DB {
  storeImprinting(ctr: ImprintingContract): Promise<void>
  getImprinting(): Promise<ImprintingContract | void>
  // invalidateImprinting(): Promise<void>
  storeOrchestration(ctr: OrchestrationContract): Promise<void>
  getOrchestration(): Promise<OrchestrationContract | void>
  storeCtr(ctr: RoleContract<Role>): Promise<void>
  findCtr<R extends Role>(as: AbstractIdentity<R>): Promise<RoleContract<R>[]>
}
