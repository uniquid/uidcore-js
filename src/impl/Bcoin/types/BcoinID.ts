import { Role } from '../../../types/data/Identity'
import { ID } from '../../../types/layers/ID'
import { HDPath, PublicKey } from '../BcoinID/HD'
import { BcoinAbstractIdentity } from './data/BcoinIdentity'
export interface BcoinID extends ID {
  signFor(abstrId: BcoinAbstractIdentity<Role>, hash: Buffer, der?: boolean): Buffer
  publicKeyAtPath(path: HDPath): PublicKey
}
