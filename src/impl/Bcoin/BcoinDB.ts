import { existsSync, mkdirSync } from 'fs'
import * as path from 'path'
import { IdAddress, Role } from '../../types/data/Identity'
import {
  Contract,
  ImprintingContract,
  OrchestrationContract,
  ProviderContract,
  UserContract
} from './../../types/data/Contract'
import { AbstractIdentity } from './../../types/data/Identity'
import { BcoinDB } from './types/BcoinDB'

// tslint:disable-next-line:no-require-imports
const LokiConstructor = require('lokijs')
/**
 * Options for constructing a {@link BcoinDB}
 * @interface Options
 * @export
 */
export interface Options {
  /**
   * absolute path to the {@link BcoinDB} home folder for file persistence
   * @type {string}
   * @memberof Options
   */
  home: string
}
/**
 * constructs a {@link BcoinDB}
 * This implementation uses a LokiDB as persistence helper
 * @param {Options} options Options
 * @returns {Promise<BcoinDB>}
 */
export const makeBcoinDB = (options: Options): Promise<BcoinDB> =>
  new Promise((resolve, reject) => {
    if (!existsSync(options.home)) {
      mkdirSync(options.home)
    }

    const db = new LokiConstructor(path.join(options.home, 'db.json'), {
      autoload: true,
      autosave: true,
      serializationMethod: 'pretty',
      autoloadCallback
    })

    function autoloadCallback() {
      const contracts = db.addCollection('contracts')

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

      const storeCtr = (ctr: Contract) => (contracts.insert(ctr), void 0)

      const getLastUserContractIdentity = () =>
        (((contracts.find({ 'identity.role': Role.User, 'identity.ext': '0' }) as UserContract[]).sort(
          (ctr1, ctr2) => ctr2.identity.index - ctr1.identity.index
        )[0] as UserContract) || { identity: { role: Role.User, index: 0 } }).identity

      const getLastProviderContractIdentity = () =>
        (((contracts.find({ 'identity.role': Role.Provider, 'identity.ext': '1' }) as ProviderContract[]).sort(
          (ctr1, ctr2) => ctr2.identity.index - ctr1.identity.index
        )[0] as ProviderContract) || {
          identity: { role: Role.Provider, index: -1 }
        }).identity

      const getActiveRoleContracts = () =>
        contracts.find({
          revoked: null,
          orchestration: { $ne: true }
        }) as Contract[]

      const revokeContract = (revoker: IdAddress) => {
        const ctr = contracts.findOne({
          revoked: null,
          revoker,
          orchestration: { $ne: true }
        }) as Contract
        ctr.revoked = new Date().valueOf()
        contracts.update(ctr)
      }

      const getPayload = (absId: AbstractIdentity<Role>) =>
        [contracts.findOne({ identity: absId }) as Contract].map(ctr => ctr.payload)[0]

      const getContractForExternalUser = (userAddr: IdAddress) =>
        contracts.findOne({
          'identity.role': Role.Provider,
          contractor: userAddr,
          revoked: null
        }) as ProviderContract
      const findContractsWithUnresolvedProviderNames = () =>
        contracts.find({
          'identity.role': Role.User,
          providerName: null
        }) as UserContract[]
      const setProviderName = (providerAddress: IdAddress, providerName: string) => {
        contracts.findAndUpdate(
          { 'identity.role': Role.User, contractor: providerAddress },
          (userContract: UserContract) => (userContract.providerName = providerName)
        )
      }
      const findUserContractsByProviderName = (providerName: string): UserContract[] =>
        contracts.find({ 'identity.role': Role.User, providerName })

      const bcoinDB: BcoinDB = {
        findUserContractsByProviderName,
        getContractForExternalUser,
        storeImprinting,
        getImprinting,
        storeOrchestration,
        getOrchestration,
        storeCtr,
        getLastUserContractIdentity,
        getLastProviderContractIdentity,
        getActiveRoleContracts,
        revokeContract,
        getPayload,
        findContractsWithUnresolvedProviderNames,
        setProviderName
      }
      resolve(bcoinDB)
    }
  })
