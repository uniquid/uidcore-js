import { AbstractIdentity, Identity, Role } from '../data/Identity'

export interface ID {
  signFor(absId: AbstractIdentity<Role>, doc: string): string
  identityFor<R extends Role>(absId: AbstractIdentity<R>): Identity<R>
}
