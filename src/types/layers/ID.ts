import { AbstractIdentity, Identity, Role } from '../data/Identity'

export interface ID {
  signFor<R extends Role>(absId: AbstractIdentity<R>, doc: string): string
  identityFor<R extends Role>(absId: AbstractIdentity<R>): Identity<R>
}
