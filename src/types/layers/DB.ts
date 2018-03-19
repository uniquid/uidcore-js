import { Contract, ContractOf } from '../data/Contract'
import { IdAddress, Role } from '../data/Identity'
import { NodeInfo } from '../data/NodeInfo'

export interface DB {
  storeCtr<CT extends Contract>(ctr: CT): Promise<CT>
  findCtr<RT extends Role>(as: RT, address: IdAddress): Promise<ContractOf[RT]>
  getInfo(): Promise<NodeInfo | null>
  setInfo<NI extends NodeInfo>(nodeInfo: NI): Promise<NI>
}
