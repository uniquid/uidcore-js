import { AbstractIdentity, Role } from '../../../../types/data/Identity'
export interface BcoreAbstractIdentity<R extends Role> extends AbstractIdentity<R> {}
export interface Identity<R extends Role> extends BcoreAbstractIdentity<R> {}
