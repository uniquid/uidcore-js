import { IdAddress, Identity } from '../../../../types/data/Identity'
import { BcoinIdentity } from '../../types/data/BcoinIdentity'
import { BCTX } from '../Pool'
import {
  ImprintingContract,
  OrchestrationContract,
  Payload,
  ProviderContract,
  RoleContract,
  UserContract
} from './../../../../types/data/Contract'
import { Role } from './../../../../types/data/Identity'
// tslint:disable:no-use-before-declare

export const getRoleContracts = (identities: Identity<Role>[]) => (txs: BCTX[]) =>
  txs.filter(isContractTX()).reduce<RoleContract[]>((contracts, tx) => {
    const identity = identities.find(id => id.address === getProviderAddress(tx) || id.address === getUserAddress(tx))
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

export const convertToImprintingContract = (imprintingAddress: IdAddress, txs: BCTX[]): ImprintingContract | void => {
  const imprTx = txs.find(isImprintingTX(imprintingAddress))

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
export const convertToOrchestrationContract = (
  imprintingContract: ImprintingContract,
  orchestrationAddress: IdAddress,
  txs: BCTX[]
): OrchestrationContract | void => {
  const imprintingAddress = imprintingContract.revoker
  const orchTx = txs.filter(isContractTX(true)).find(isOrchestrationTX(orchestrationAddress, imprintingAddress))
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
export interface ConvertToRoleContract {
  (identity: BcoinIdentity<Role.User>, tx: BCTX): UserContract
  (identity: BcoinIdentity<Role.Provider>, tx: BCTX): ProviderContract
}

export const convertToRoleContract = (identity: BcoinIdentity<Role>, tx: BCTX): RoleContract => {
  const revoker = getRevokerAddress(tx)
  const isProviderIdentity = identity.role === Role.Provider
  const contractor = isProviderIdentity ? getUserAddress(tx) : getProviderAddress(tx)
  const payload = getPayload(tx)
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
export const getRevokingAddresses = (revokingAddresses: IdAddress[]) => (txs: BCTX[]) => {
  const txInputAddresses = txs
    // .map(tx => (console.log('------------------tx.inputs', tx.inputs), tx))
    .map(tx => (tx.inputs as any[]).map(base58))
    .reduce((addresses, inputAddr) => addresses.concat(inputAddr), [])

  return revokingAddresses.filter(revokingAddress => txInputAddresses.includes(revokingAddress))
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

export const isImprintingTX = (imprintingAddress: IdAddress) => (tx: BCTX) =>
  !!tx.outputs.find((output: any) => base58(output) === imprintingAddress)
export const isOrchestrationTX = (orchestrationAddress: IdAddress, imprintingAddress: IdAddress) => (tx: BCTX) =>
  getProviderAddress(tx) === imprintingAddress && getChangeAddress(tx) === orchestrationAddress

export const getProviderAddress = (tx: any): IdAddress => base58(tx.inputs[0])
// const getRechargeAddress = (tx: any): IdAddress | null => (tx.inputs.length > 1 ? base58(tx.inputs[1]) : null)

export const getUserAddress = (tx: any): IdAddress => base58(tx.outputs[0])
export const getPayload = (tx: any): Payload => Array.from(tx.outputs[1].script.code[1].data as Buffer) // .toString()

// tslint:disable-next-line:no-magic-numbers
export const getRevokerAddress = (tx: any): IdAddress => base58(tx.outputs[2])
// tslint:disable-next-line:no-magic-numbers
export const getChangeAddress = (tx: any): IdAddress => base58(tx.outputs[3])

const base58 = (addr: any): IdAddress => addr.getAddress().toBase58()
