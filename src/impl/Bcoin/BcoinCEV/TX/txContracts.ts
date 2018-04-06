import { IdAddress } from '../../../../types/data/Identity'
import { BCTX } from '../Pool'
import { ImprintingContract, OrchestrationContract } from './../../../../types/data/Contract'
import { Role } from './../../../../types/data/Identity'
import { BcoinIdentity } from './../../types/data/BcoinIdentity'

export const convertToImprintingContract = (imprintingAddress: IdAddress, txs: BCTX[]): ImprintingContract | void => {
  const imprTx = txs.find(isImprintingTX(imprintingAddress))

  return imprTx
    ? {
        imprinting: true,
        imprintingAddress,
        received: new Date().valueOf(),
        contractor: getProviderAddress(imprTx),
      }
    : void 0
}
export const convertToOrchestrationContract = (
  imprintingContract: ImprintingContract,
  orchestrationAddress: IdAddress,
  txs: BCTX[]
): OrchestrationContract | void => {
  const imprintingAddress = imprintingContract.imprintingAddress
  const orchTx = txs.filter(isContractTX).find(isOrchestrationTX(orchestrationAddress, imprintingAddress))
  if (orchTx) {
    // tslint:disable-next-line:no-magic-numbers
    const revoker = getRevokerAddress(orchTx)
    const orchestrationIdentity: BcoinIdentity<Role.Provider> = {
      address: imprintingAddress,
      role: Role.Provider,
      index: 0,
      ext: '1',
    }
    const user = getUserAddress(orchTx)
    const nextProviderAddress = getChangeAddress(orchTx)
    const payload = getPayload(orchTx)

    return {
      identity: orchestrationIdentity,
      orchestration: true,
      received: new Date().valueOf(),
      contractor: user,
      revoker,
      nextProviderAddress,
      payload,
    }
  }
  // return { orchestration: true }
}

export const isContractTX = (tx: BCTX) => {
  return true
}

export const isImprintingTX = (imprintingAddress: IdAddress) => (tx: BCTX) =>
  !!tx.outputs.find((output: any) => base58(output) === imprintingAddress)
export const isOrchestrationTX = (orchestrationAddress: IdAddress, imprintingAddress: IdAddress) => (tx: BCTX) =>
  getProviderAddress(tx) === imprintingAddress && getChangeAddress(tx) === orchestrationAddress

const getProviderAddress = (tx: any): IdAddress => base58(tx.inputs[0])
// const getRechargeAddress = (tx: any): IdAddress | null => (tx.inputs.length > 1 ? base58(tx.inputs[1]) : null)

const getUserAddress = (tx: any): IdAddress => base58(tx.outputs[0])
const getPayload = (tx: any): string => (tx.outputs[1].script.code[1].data as Buffer).toString()
// tslint:disable-next-line:no-magic-numbers
const getRevokerAddress = (tx: any): IdAddress => base58(tx.outputs[2])
// tslint:disable-next-line:no-magic-numbers
const getChangeAddress = (tx: any): IdAddress => base58(tx.outputs[3])

const base58 = (addr: any): IdAddress => addr.getAddress().toBase58()
