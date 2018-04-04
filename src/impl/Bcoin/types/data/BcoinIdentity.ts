import { AbstractIdentity, Identity, Role } from '../../../../types/data/Identity'

export type ExtPath = '0' | '1'
export interface BcoinAbstractIdentity<R extends Role> extends AbstractIdentity<R> {
  ext?: ExtPath
}
export interface BcoinIdentity<R extends Role> extends BcoinAbstractIdentity<R>, Identity<R> {}
