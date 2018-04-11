import { AbstractIdentity, IdAddress, Identity, Role } from '../data/Identity'

export interface ID {
  signFor(absId: AbstractIdentity<Role>, hash: Buffer): Buffer
  identityFor<R extends Role>(absId: AbstractIdentity<R>): Identity<R>
  getImprintingAddress(): IdAddress
  getOrchestrateAddress(): IdAddress
}
