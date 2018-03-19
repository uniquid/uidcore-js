import { Contract } from '../data/Contract'
import { Identity } from '../data/Identity'

export type onContract = (ctr: Contract) => void
export type subscribeNextContract = (sub: onContract) => void

export type RPC = (
  onContract: onContract
) => {
  watch(ids: Identity[]): void
}
