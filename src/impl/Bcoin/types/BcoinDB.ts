import { IdAddress } from '../../../types/data/Identity'
import { DB } from '../../../types/layers/DB'
import { UserContract } from './../../../types/data/Contract'
export interface BcoinDB extends DB {
  findContractsWithUnresolvedProviderNames(): UserContract[]
  setProviderName(providerAddress: IdAddress, providerName: string): void
}
