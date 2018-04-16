import { ProviderContract, RoleContract } from './types/data/Contract'
import { AbstractIdentity, IdAddress, Identity, Role } from './types/data/Identity'
import { CEV } from './types/layers/CEV'
import { DB } from './types/layers/DB'
import { ID } from './types/layers/ID'
export interface CH {
  sign(absId: AbstractIdentity<Role>, hash: Buffer): Buffer
  getPayload(abstrId: AbstractIdentity<Role>): RoleContract['payload']
  getContractForExternalUser(userAddr: IdAddress): ProviderContract | void
  identityFor<R extends Role>(absId: AbstractIdentity<R>): Identity<R>
}
export const CH = (cev: CEV, db: DB, id: ID): CH => {
  const sign = id.signFor
  // const verify
  const getPayload = db.getPayload
  const getContractForExternalUser = db.getContractForExternalUser
  const identityFor = id.identityFor

  return {
    // verify,
    identityFor,
    getContractForExternalUser,
    sign,
    getPayload,
  }
}
