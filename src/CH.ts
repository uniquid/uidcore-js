import { AbstractIdentity, Role } from './types/data/Identity'
import { CEV } from './types/layers/CEV'
import { DB } from './types/layers/DB'
import { ID } from './types/layers/ID'
export interface CH {
  sign(absId: AbstractIdentity<Role>, hash: Buffer): Buffer
  getPayload(abstrId: AbstractIdentity<Role>): string
}
export const CH = (cev: CEV, db: DB, id: ID) => {
  const sign = id.signFor
  // const verify
  const getPayload = db.getPayload

  return {
    // verify,
    sign,
    getPayload,
  }
}
