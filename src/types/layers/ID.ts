import { AbstractIdentity, Identity } from '../data/Identity'

export interface ID {
  signFor(absId: AbstractIdentity, rawContract: string): string
  identityFor(absId: AbstractIdentity): Identity
}
