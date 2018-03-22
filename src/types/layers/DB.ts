import { Contract, ImprintingContract, OrchestrationContract } from '../data/Contract'
import { AbstractIdentity, Role } from '../data/Identity'

export interface DB {
  storeImprinting(ctr: ImprintingContract): Promise<void>
  getImprinting(): Promise<ImprintingContract | null>
  invalidateImprinting(): Promise<void>
  storeOrchestration(ctr: OrchestrationContract): Promise<void>
  getOrchestration(): Promise<OrchestrationContract | null>
  storeCtr(ctr: Contract<Role>): Promise<void>
  findCtr<R extends Role>(as: AbstractIdentity<R>): Promise<Contract<R>[]>
}
