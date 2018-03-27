import { AbstractIdentity, Identity, Role } from '../../../../types/data/Identity'
export interface BcoreAbstractIdentity<R extends Role> extends AbstractIdentity<R> {
  ext?: '0' | '1'
}
export interface BcoreIdentity<R extends Role> extends BcoreAbstractIdentity<R>, Identity<R> {}
