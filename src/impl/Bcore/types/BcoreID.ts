import { ID } from '../../../types/layers/ID'
import { DerivePrivateKey } from './../BcoreID/HD'
export interface BcoreID extends ID {
  derivePrivateKey: DerivePrivateKey
}
