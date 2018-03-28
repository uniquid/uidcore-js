import { AbstractIdentity, Identity, Role } from '../../../../types/data/Identity'
export interface BcoinAbstractIdentity<R extends Role> extends AbstractIdentity<R> {
  ext?: '0' | '1'
}
export interface BcoinIdentity<R extends Role> extends BcoinAbstractIdentity<R>, Identity<R> {}
