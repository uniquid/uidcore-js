/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { IdAddress } from '../../../types/data/Identity'
import { Contract, ImprintingContract, UserContract } from './../../../types/data/Contract'
import { BCPool } from './../BcoinCEV/Pool'
import { BcoinDB } from './../types/BcoinDB'
import { BcoinID } from './../types/BcoinID'
import {
  convertToImprintingContract,
  convertToOrchestrationContract,
  getRevokingAddresses,
  getRoleContracts
} from './TX/txContracts'

type OnContracts = (ctrs: Contract[], revokingAddresses: IdAddress[]) => void
const loopRoleContractWatch = async (
  db: BcoinDB,
  pool: BCPool,
  id: BcoinID,
  watchahead: number,
  onContracts: OnContracts,
  logger: any
) => {
  const _nextWatchIdentities = [db.getLastProviderContractIdentity(), db.getLastUserContractIdentity()]
    .map(lastIdentity => {
      const identities = []
      for (let offset = 1; offset <= watchahead; offset++) {
        const waIdentity = id.identityFor({
          ...lastIdentity,
          index: lastIdentity.index + offset
        })
        identities.push(waIdentity)
      }

      return identities
    })
    .reduce((a, b) => a.concat(b))
  const nextWatchIdentities = Array.from(new Set(_nextWatchIdentities))

  const nextWatchAddresses = nextWatchIdentities.map(identity => identity.address)

  const watchingRevokingAddresses = db.getActiveRoleContracts().map(ctr => ctr.revoker)
  logger.debug(`watchingRevokingAddresses: `, watchingRevokingAddresses.reduce((s, a, i) => `${s}\n${i} : ${a}`, ''))
  logger.debug(`nextWatchAddresses: `, nextWatchAddresses.reduce((s, a, i) => `${s}\n${i} : ${a}`, ''))
  const txs = await pool.watchAddresses(nextWatchAddresses.concat(watchingRevokingAddresses))
  const newContracts = getRoleContracts(nextWatchIdentities, txs)
  logger.info(`\n++NEW Role Contracts: ${newContracts.length} `)
  logger.debug(newContracts.reduce((s, c) => `${s}${c.identity.role}[${c.identity.index}] -> ${c.contractor}\n`, ''))
  newContracts.forEach(db.storeCtr)
  const revokingAddresses = getRevokingAddresses(watchingRevokingAddresses, txs)
  logger.debug(`\n--REVOKING Addresses: ${revokingAddresses.length}`)
  logger.debug(revokingAddresses.reduce((s, a) => `${s}${a}\n`, ''))
  revokingAddresses.forEach(db.revokeContract)
  onContracts(newContracts, revokingAddresses)
  loopRoleContractWatch(db, pool, id, watchahead, onContracts, logger).catch(err =>
    logger.error('loopRoleContractWatch ERROR:', err)
  )
}

const ensureImprinting = async (db: BcoinDB, id: BcoinID, pool: BCPool, logger: any) => {
  let shallBeImprintingContract = db.getImprinting()
  const imprintingAddress = id.getImprintingAddress()
  logger.info(
    `---------------------------------------------------------- IMPR (${imprintingAddress}) `,
    shallBeImprintingContract
  )
  while (!shallBeImprintingContract) {
    const txs = await pool.watchAddresses([imprintingAddress])
    logger.info(`---------------------------------------------------------- got IMPR ${imprintingAddress}`, txs)
    shallBeImprintingContract = convertToImprintingContract(imprintingAddress, txs)
    if (shallBeImprintingContract) {
      db.storeImprinting(shallBeImprintingContract)
    }
  }

  return shallBeImprintingContract
}

const ensureOrchestration = (db: BcoinDB, id: BcoinID, pool: BCPool, logger: any) => async (
  imprintingContract: ImprintingContract
) => {
  let shallBeOrchestrationContract = db.getOrchestration()
  const orchestrationAddress = id.getOrchestrateAddress()
  while (!shallBeOrchestrationContract) {
    logger.info(
      `---------------------------------------------------------- ORCH (${orchestrationAddress}) `,
      shallBeOrchestrationContract
    )
    const txs = await pool.watchAddresses([orchestrationAddress])
    logger.info(`---------------------------------------------------------- got ORCH ${orchestrationAddress}`, txs)
    shallBeOrchestrationContract = convertToOrchestrationContract(imprintingContract, orchestrationAddress, txs)
    if (shallBeOrchestrationContract) {
      db.storeOrchestration(shallBeOrchestrationContract)
      db.revokeContract(imprintingContract.revoker)
    }
  }

  return shallBeOrchestrationContract
}
const providerNameProcess = (db: BcoinDB, providerNameResolver: ProviderNameResolver, logger: any) => {
  let contractsWithUnresolvedProviderNames: UserContract[] = []
  const trigger = () => {
    contractsWithUnresolvedProviderNames = db.findContractsWithUnresolvedProviderNames()
    next()
  }

  return {
    trigger
  }

  function next() {
    const contract = contractsWithUnresolvedProviderNames.shift()
    if (contract) {
      const providerAddress = contract.contractor
      providerNameResolver(providerAddress)
        .then(providerName => db.setProviderName(providerAddress, providerName))
        .catch(error => {
          logger.error(`ProviderNameResolver [${providerAddress}] Error`, error)
          // tslint:disable-next-line:no-magic-numbers
          setTimeout(trigger, 10000)
        })
    }
  }
}
export type ProviderNameResolver = (providerAddress: IdAddress) => Promise<string>

/**
 * This starts the {@link BcoinCEV} main lifecycle process,
 * when started it ensures node imprinting contract, then ensures node orchestration contract
 *
 * Ensureness is guaranteed by the presence of contracts in the {@link BcoinDB} persistence
 * if not present pool should watch on respective {@link IdAddress addresses} waiting for contracts to come
 *
 * Then it loops in watching for node's user and provider {@link IdAddress}es for respective {@link Contract}s
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {BCPool} pool a BCPool instance
 * @param {number} watchahead how many {@link IdAddress} to watch ahead the latest BIP32 index on user and provider {@link Contract}
 * @param {ProviderNameResolver} providerNameResolver
 */
export const startContractManager = async (
  db: BcoinDB,
  id: BcoinID,
  pool: BCPool,
  watchahead: number,
  providerNameResolver: ProviderNameResolver,
  logger: any
) =>
  ensureImprinting(db, id, pool, logger).then(ensureOrchestration(db, id, pool, logger)).then(() => {
    const { trigger } = providerNameProcess(db, providerNameResolver, logger)
    loopRoleContractWatch(db, pool, id, watchahead, trigger, logger).catch(err =>
      logger.error('loopRoleContractWatch ERROR:', err)
    )
    trigger()
  })
