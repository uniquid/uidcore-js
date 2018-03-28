import LokiConstructor from 'lokijs'
import { AbstractIdentity, Role } from '../../types/data/Identity'
import { Contract, ImprintingContract, OrchestrationContract, RoleContract } from './../../types/data/Contract'
import { BcoinDB } from './types/BcoinDB'

export const makeBcoinDB = (): BcoinDB => {
  const db = new LokiConstructor('db.json')
  const contracts = db.addCollection<Contract>('contracts')

  const getImprinting = () => Promise.resolve(contracts.find({ imprinting: true })[0] as ImprintingContract)

  const storeImprinting = (ctr: ImprintingContract) => {
    if (getImprinting()) {
      throw new TypeError('Already imprinted')
    }
    contracts.insert(ctr)

    return Promise.resolve()
  }

  const getOrchestration = () => Promise.resolve(contracts.find({ orchestration: true })[0] as OrchestrationContract)

  const storeOrchestration = (ctr: OrchestrationContract) => {
    if (getOrchestration()) {
      throw new TypeError('Already orchestrated')
    }
    contracts.insert(ctr)

    return Promise.resolve()
  }

  const storeCtr = (ctr: RoleContract<Role>) => Promise.resolve((contracts.insert(ctr), void 0))
  const findCtr = <R extends Role>(identity: AbstractIdentity<R>) => Promise.resolve(contracts.find({ identity }))

  return {
    storeImprinting,
    getImprinting,
    storeOrchestration,
    getOrchestration,
    storeCtr,
    findCtr: findCtr as BcoinDB['findCtr'],
  }
}
