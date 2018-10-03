/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { IdAddress, Identity } from '../../../../types/data/Identity'
import { BcoinIdentity } from '../../types/data/BcoinIdentity'
import { BCTX } from '../Pool'
import {
  Contract,
  ImprintingContract,
  OrchestrationContract,
  Payload,
  ProviderContract,
  UserContract
} from './../../../../types/data/Contract'
import { Role } from './../../../../types/data/Identity'
// tslint:disable:no-use-before-declare

/**
 * Checks and converts raw Bcoin {@link BCTX transactions} into valid {@link Contract}s
 *
 * @param {Identity<Role>[]} identities
 * @param {BCTX[]} rawBcoinTxs
 */
export const getRoleContracts = (identities: Identity<Role>[], rawBcoinTxs: BCTX[]) =>
  rawBcoinTxs.filter(isContractTX()).reduce<Contract[]>((contracts, tx) => {
    const identity = identities.find(
      id => id.address === (id.role === Role.Provider ? getProviderAddress(tx) : getUserAddress(tx))
    )
    if (identity) {
      const providerCtr = convertToRoleContract(
        {
          ...identity,
          ext: identity.role === Role.Provider ? '1' : '0'
        },
        tx
      )
      contracts.push(providerCtr)
    }

    return contracts
  }, [])

/**
 * Attempt to find a {@link ImprintingContract} representation in raw Bcoin {@link BCTX transactions}
 *
 * Converts it into valid {@link ImprintingContract}
 *
 * @param {IdAddress} imprintingAddress
 * @param {BCTX[]} rawBcoinTxs
 * @returns {(ImprintingContract | void)} an {@link ImprintingContract} or undefined if not present
 */
export const convertToImprintingContract = (
  imprintingAddress: IdAddress,
  rawBcoinTxs: BCTX[]
): ImprintingContract | void => {
  const imprTx = rawBcoinTxs.find(isImprintingTX(imprintingAddress))

  return imprTx
    ? {
        imprinting: true,
        identity: {
          role: Role.Provider,
          address: imprintingAddress,
          index: 0,
          ext: '0'
        },
        revoker: imprintingAddress,
        revoked: null,
        received: new Date().valueOf(),
        contractor: getProviderAddress(imprTx),
        payload: []
      }
    : void 0
}
/**
 * Attempt to find a {@link OrchestrationContract} representation in raw Bcoin {@link BCTX transactions}
 *
 * Converts it into valid {@link OrchestrationContract}
 *
 * @param {ImprintingContract} imprintingContract
 * @param {IdAddress} imprintingAddress
 * @param {BCTX[]} rawBcoinTxs
 * @returns {(OrchestrationContract | void)} an {@link OrchestrationContract} or undefined if not present
 */
export const convertToOrchestrationContract = (
  imprintingContract: ImprintingContract,
  orchestrationAddress: IdAddress,
  rawBcoinTxs: BCTX[]
): OrchestrationContract | void => {
  const imprintingAddress = imprintingContract.revoker
  const orchTx = rawBcoinTxs.filter(isContractTX(true)).find(isOrchestrationTX(orchestrationAddress, imprintingAddress))
  if (orchTx) {
    const revoker = getRevokerAddress(orchTx)
    const orchestrationIdentity: BcoinIdentity<Role.Provider> = {
      address: imprintingAddress,
      role: Role.Provider,
      index: 0,
      ext: '0'
    }
    const user = getUserAddress(orchTx)
    const payload = getPayload(orchTx)

    return {
      identity: orchestrationIdentity,
      orchestration: true,
      received: new Date().valueOf(),
      contractor: user,
      revoker,
      payload,
      revoked: null
    }
  }
}

/**
 * converts a raw Bcoin {@link BCTX transaction} into a valid {@link Contract} for the given {@link BcoinIdentity<Role> identity}
 *
 *
 * @param {BcoinIdentity<Role>} identity
 * @param {BCTX} rawBcoinTx
 * @returns {Contract}
 */
export const convertToRoleContract = (identity: BcoinIdentity<Role>, rawBcoinTx: BCTX): Contract => {
  const revoker = getRevokerAddress(rawBcoinTx)
  const isProviderIdentity = identity.role === Role.Provider
  const contractor = isProviderIdentity ? getUserAddress(rawBcoinTx) : getProviderAddress(rawBcoinTx)
  const payload = getPayload(rawBcoinTx)
  const contract = {
    identity,
    received: new Date().valueOf(),
    contractor,
    revoker,
    payload,
    revoked: null
  }
  if (identity.role === Role.Provider) {
    return contract as ProviderContract
  } else {
    return { ...contract, providerName: null } as UserContract
  }
}

/**
 * filter the {@link IdAddress[] revoking addresses} against {@link BCTX[] raw Bcoin transactions} provided
 *
 * A revoking address present in any input of the provided transactions is considered as a revoking act
 *
 * @param {IdAddress[]} revokingAddresses
 * @param {BCTX[]} rawBcoinTxs
 * @returns {IdAddress[]} revoker's {@link IdAddress[] addresses} found in inputs are returned
 */
export const getRevokingAddresses = (revokingAddresses: IdAddress[], rawBcoinTxs: BCTX[]) => {
  const txInputAddresses = rawBcoinTxs
    .map(tx => (tx.inputs as any[]).map(base58))
    .reduce((addresses, inputAddr) => addresses.concat(inputAddr), [])

  const presentRevokingAddresses = revokingAddresses.filter(revokingAddress =>
    txInputAddresses.includes(revokingAddress)
  ) as IdAddress[]
  console.log('GET REVOKING:')
  console.log('revokingAddresses:', revokingAddresses)
  console.log('txInputAddresses:', txInputAddresses)
  console.log('presentRevokingAddresses:', presentRevokingAddresses)

  return presentRevokingAddresses
}

export const isContractTX = (orchestration = false) => (
  tx: BCTX // tslint:disable-next-line:no-magic-numbers
) =>
  // tslint:disable-next-line:no-magic-numbers
  (tx.inputs.length === 1 || tx.inputs.length === 2) &&
  // tslint:disable-next-line:no-magic-numbers
  (orchestration || tx.outputs.length === 4) &&
  tx.outputs[1].script &&
  tx.outputs[1].script.code &&
  tx.outputs[1].script.code[1] &&
  tx.outputs[1].script.code[1].data &&
  // tslint:disable-next-line:no-magic-numbers
  tx.outputs[1].script.code[1].data.length === 80

export const isImprintingTX = (imprintingAddress: IdAddress) => (rawBcoinTx: BCTX) =>
  !!rawBcoinTx.outputs.find((output: any) => base58(output) === imprintingAddress)
export const isOrchestrationTX = (orchestrationAddress: IdAddress, imprintingAddress: IdAddress) => (
  rawBcoinTx: BCTX
) => getProviderAddress(rawBcoinTx) === imprintingAddress && getChangeAddress(rawBcoinTx) === orchestrationAddress

export const getProviderAddress = (rawBcoinTx: BCTX): IdAddress => base58(rawBcoinTx.inputs[0])
// const getRechargeAddress = (tx: any): IdAddress | null => (tx.inputs.length > 1 ? base58(tx.inputs[1]) : null)

export const getUserAddress = (rawBcoinTx: BCTX): IdAddress => base58(rawBcoinTx.outputs[0])
export const getPayload = (rawBcoinTx: BCTX): Payload => Array.from(rawBcoinTx.outputs[1].script.code[1].data as Buffer) // .toString()

// tslint:disable-next-line:no-magic-numbers
export const getRevokerAddress = (rawBcoinTx: BCTX): IdAddress => base58(rawBcoinTx.outputs[2])
// tslint:disable-next-line:no-magic-numbers
export const getChangeAddress = (rawBcoinTx: BCTX): IdAddress => base58(rawBcoinTx.outputs[3])

const base58 = (addr: any): IdAddress => addr.getAddress().toBase58()
