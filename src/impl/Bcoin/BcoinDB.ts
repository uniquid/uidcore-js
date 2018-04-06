import * as LokiConstructor from 'lokijs'
import { AbstractIdentity, Role } from '../../types/data/Identity'
import { Contract, ImprintingContract, OrchestrationContract, RoleContract } from './../../types/data/Contract'
import { BcoinDB } from './types/BcoinDB'

export const makeBcoinDB = (): Promise<BcoinDB> =>
  new Promise((resolve, reject) => {
    const db = new LokiConstructor('db.json', {
      autoload: true,
      autosave: true,
      autoloadCallback: () => {
        const contracts = db.addCollection<Contract>('contracts')

        const getImprinting = () =>
          Promise.resolve(
            contracts.findOne({
              imprinting: true,
            }) as ImprintingContract | undefined
          )

        const storeImprinting = (ctr: ImprintingContract) => {
          return getImprinting().then(imprCtr => {
            if (imprCtr) {
              throw new TypeError('Already imprinted')
            }
            contracts.insert(ctr)
          })
        }

        const getOrchestration = () =>
          Promise.resolve(
            contracts.findOne({
              orchestration: true,
            }) as OrchestrationContract | undefined
          )

        const storeOrchestration = (ctr: OrchestrationContract) => {
          return getOrchestration().then(orchCtr => {
            if (orchCtr) {
              throw new TypeError('Already orchestrated')
            }
            contracts.insert(ctr)
          })
        }

        const storeCtr = (ctr: RoleContract) => Promise.resolve((contracts.insert(ctr), void 0))
        const findCtr = <R extends Role>(identity: AbstractIdentity<R>) => Promise.resolve(contracts.find({ identity }))

        resolve({
          storeImprinting,
          getImprinting,
          storeOrchestration,
          getOrchestration,
          storeCtr,
          findCtr: findCtr as BcoinDB['findCtr'],
        })
      },
    })
  })
