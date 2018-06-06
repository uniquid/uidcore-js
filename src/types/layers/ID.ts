import { AbstractIdentity, IdAddress, Identity, Role } from '../data/Identity'

/**
 * The Uniquid Identity Layer provides crypto identity related functionalities
 *
 * @interface ID
 * @export
 */
export interface ID {
  /**
   * signs a Buffer using the requested identity
   *
   * @param {AbstractIdentity<Role>} abstractId the abstract Identity to use for signing
   * @param {Buffer} bytes the bytes to be signed
   * @returns {Buffer} signed bytes
   * @memberof ID
   */
  signFor(abstractId: AbstractIdentity<Role>, bytes: Buffer): Buffer
  /**
   * gets a full Identity from the provided AbstractIdentity
   *
   * @template R the identity Role
   * @param {AbstractIdentity<R>} abstractId the abstract identity
   * @returns {Identity<R>} the full Identity
   * @memberof ID
   */
  identityFor<R extends Role>(abstractId: AbstractIdentity<R>): Identity<R>
  /**
   * gets the imprinting address
   *
   * @returns {IdAddress}
   * @memberof ID
   */
  getImprintingAddress(): IdAddress
  /**
   * gets the orchestration address
   *
   * @returns {IdAddress}
   * @memberof ID
   */
  getOrchestrateAddress(): IdAddress
}
