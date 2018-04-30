export type IdAddress = string
export type IdIndex = number
/**
 * Role in a contract may be User or Provider
 *
 * @enum {number}
 * @export
 */
export enum Role {
  Provider = 'PROVIDER',
  User = 'USER'
}
/**
 * An abstract representaton of an internal identity
 *
 * @interface AbstractIdentity
 * @template R role of Identity
 * @export
 */
export interface AbstractIdentity<R extends Role> {
  /**
   * the identity role
   *
   * @type {R}
   * @memberof AbstractIdentity
   */
  role: R
  /**
   * the identity index
   *
   * @type {number}
   * @memberof AbstractIdentity
   */
  index: number
}
/**
 * A full identity complete with address
 *
 * @interface Identity
 * @extends {AbstractIdentity<R>}
 * @template R
 */
export interface Identity<R extends Role> extends AbstractIdentity<R> {
  address: IdAddress
}
