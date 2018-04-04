import { Role } from '../../../types/data/Identity'
import { ID } from '../../../types/layers/ID'
import { DerivePrivateKey } from './../BcoinID/HD'
import { BcoinAbstractIdentity } from './data/BcoinIdentity'
export interface BcoinID extends ID {
  derivePrivateKey: DerivePrivateKey
  signFor(abstrId: BcoinAbstractIdentity<Role>, hash: Buffer, der?: boolean): Buffer
}
