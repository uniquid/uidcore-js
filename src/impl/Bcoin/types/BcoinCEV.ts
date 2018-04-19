import { CEV } from '../../../types/layers/CEV'
import { HDPath } from '../BcoinID/HD'
export interface BcoinCEV extends CEV {
  sign(txString: string, paths: HDPath[]): Promise<string>
}
