import * as LokiConstructor from 'lokijs'
import * as path from 'path'
import { Role } from '../../types/data/Identity'
import {
  Contract,
  ImprintingContract,
  OrchestrationContract,
  ProviderContract,
  RoleContract,
  UserContract,
} from './../../types/data/Contract'
import { BcoinDB } from './types/BcoinDB'

export interface Options {
  home: string
}
export const makeBcoinDB = (opts: Options): Promise<BcoinDB> =>
  new Promise((resolve, reject) => {
    const db = new LokiConstructor(path.join(opts.home, 'db.json'), {
      autoload: true,
      autosave: true,
      autoloadCallback,
    })

    function autoloadCallback() {
      const contracts = db.addCollection<Contract>('contracts')

      const getImprinting = () => contracts.findOne({ imprinting: true }) as ImprintingContract | undefined

      const storeImprinting = (ctr: ImprintingContract) => {
        const imprCtr = getImprinting()
        if (imprCtr) {
          throw new TypeError('Already imprinted')
        }
        contracts.insert(ctr)
      }

      const getOrchestration = () => contracts.findOne({ orchestration: true }) as OrchestrationContract | undefined

      const storeOrchestration = (ctr: OrchestrationContract) => {
        const orchCtr = getOrchestration()
        if (orchCtr) {
          throw new TypeError('Already orchestrated')
        }
        contracts.insert(ctr)
      }

      const storeCtr = (ctr: RoleContract) => (contracts.insert(ctr), void 0)

      const getLastUserContractIdentity = () =>
        (((contracts.find({ 'identity.role': Role.User, ext: '0' } as any) as UserContract[]).sort(
          (ctr1, ctr2) => ctr2.identity.index - ctr1.identity.index
        )[0] as UserContract) || { identity: { role: Role.User, index: 0 } }).identity

      const getLastProviderContractIdentity = () =>
        (((contracts.find({ 'identity.role': Role.Provider, ext: '1' } as any) as ProviderContract[]).sort(
          (ctr1, ctr2) => ctr2.identity.index - ctr1.identity.index
        )[0] as ProviderContract) || { identity: { role: Role.Provider, index: -1 } }).identity

      const bcoinDB: BcoinDB = {
        storeImprinting,
        getImprinting,
        storeOrchestration,
        getOrchestration,
        storeCtr,
        getLastUserContractIdentity,
        getLastProviderContractIdentity,
      }
      resolve(bcoinDB)
    }
  })
