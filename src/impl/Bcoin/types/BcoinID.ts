import { ID } from '../../../types/layers/ID'
import { DerivePrivateKey } from './../BcoinID/HD'
export interface BcoinID extends ID {
  derivePrivateKey: DerivePrivateKey
}
