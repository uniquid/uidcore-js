import { Contract, ImprintingContract, OrchestrationContract } from '../data/Contract'
import { AbstractIdentity, Role } from '../data/Identity'
import { NodeInfo } from '../data/NodeInfo'

export interface DB {
  storeImprinting(ctr: ImprintingContract): Promise<void>
  storeOrchestration(ctr: OrchestrationContract): Promise<void>
  storeCtr(ctr: Contract<Role>): Promise<void>
  findCtr<R extends Role>(as: AbstractIdentity<R>): Promise<Contract<R>[]>
  getInfo(): Promise<NodeInfo | null>
  setInfo(nodeInfo: NodeInfo): Promise<void>
}
