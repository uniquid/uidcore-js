import { Contract } from '../../../../types/data/Contract'
import { Role } from '../../../../types/data/Identity'
export interface BcoreContract<R extends Role> extends Contract<R> {}
