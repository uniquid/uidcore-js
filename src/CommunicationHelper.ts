import { Payload, ProviderContract } from './types/data/Contract'
import { AbstractIdentity, IdAddress, Identity, Role } from './types/data/Identity'
import { ContractExchangeValidator } from './types/layers/ContractExchangeValidator'
import { DB } from './types/layers/DB'
import { ID } from './types/layers/ID'
/**
 * CommunicationHelper is a wrapper encapsulating {@link ContractExchangeValidator}, {@link ID}, and {@link DB} implementations
 *
 * it exposes necessary methods to user code
 *
 * @interface CommunicationHelper
 * @export
 */
export interface CommunicationHelper {
  /**
   * signs bytes with the identity specified by the priovided {@link AbstractIdentity abstract Identity}
   *
   * @param {AbstractIdentity<Role>} abstractIdentity
   * @param {Buffer} bytes
   * @returns {Buffer}
   * @memberof CommunicationHelper
   */
  sign(abstractIdentity: AbstractIdentity<Role>, bytes: Buffer): Buffer

  /**
   * Rerieve the contract's payload for the specified {@link AbstractIdentity abstract Identity}, undefined if not present
   *
   * @param {AbstractIdentity<Role>} abstractIdentity
   * @returns {Payload | void}
   * @memberof CommunicationHelper
   */
  getPayload(abstractIdentity: AbstractIdentity<Role>): Payload | void

  /**
   * retrieve the {@link ProviderContract} for the spefified {@link IdAddress user address}, or undefined if not present
   *
   * @param {IdAddress} userAddr
   * @returns {(ProviderContract | void)}
   * @memberof CommunicationHelper
   */
  getContractForExternalUser(userAddr: IdAddress): ProviderContract | void

  /**
   * Provides a complete {@link Identity} for the {@link AbstractIdentity abstract Identity} provided
   *
   * @template R identity {@link Role}
   * @param {AbstractIdentity<R>} abstractId
   * @returns {Identity<R>} the address complete {@link Identity}
   * @memberof CommunicationHelper
   */
  identityFor<R extends Role>(abstractId: AbstractIdentity<R>): Identity<R>
}

/**
 * Builds a CommunicationHelper encapsulating components provided
 *
 * @param {ContractExchangeValidator} cev
 * @param {DB} db
 * @param {ID} id
 * @returns {CommunicationHelper}
 */
export const communicationHelperFactory = (cev: ContractExchangeValidator, db: DB, id: ID): CommunicationHelper => {
  const sign = id.signFor
  // const verify
  const getPayload = db.getPayload
  const getContractForExternalUser = db.getContractForExternalUser
  const identityFor = id.identityFor

  return {
    identityFor,
    getContractForExternalUser,
    sign,
    getPayload
  }
}
