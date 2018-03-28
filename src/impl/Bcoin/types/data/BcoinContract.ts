import { RoleContract } from '../../../../types/data/Contract'
import { Role } from '../../../../types/data/Identity'
export interface BcoinContract<R extends Role> extends RoleContract<R> {}
