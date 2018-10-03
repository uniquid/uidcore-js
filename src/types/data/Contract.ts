/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { ProviderContract } from './Contract'
import { AbstractIdentity, IdAddress, Role } from './Identity'

export type ProviderName = string
export type Payload = number[]
/**
 * The Base interface for Contracts
 *
 * @interface AbstractContract
 * @template R {@link Role} for contract's identity
 * @export
 */
export interface AbstractContract<R extends Role> {
  /**
   * The AbstractIdentity for this contract
   *
   * Address shall be derived
   *
   * @type {AbstractIdentity<R>}
   * @memberof AbstractContract
   */
  identity: AbstractIdentity<R>
  /**
   * The contract counterpart address
   *
   * @type {IdAddress}
   * @memberof AbstractContract
   */
  contractor: IdAddress
  /**
   * The Revoker address
   *
   * @type {IdAddress}
   * @memberof AbstractContract
   */
  revoker: IdAddress
  /**
   * The Contract payload a {@link number[]} as a serializable representation of Buffer
   *
   * @type {Payload}
   * @memberof AbstractContract
   */
  payload: Payload
  /**
   * contract revoked timestamp (ms) or null if not revoked
   *
   * @type {(number | null)}
   * @memberof AbstractContract
   */
  revoked: number | null
  /**
   * contract received timestamp (ms)
   *
   * @type {number}
   * @memberof AbstractContract
   */
  received: number
}

/**
 * A contract as provider
 *
 * @interface ProviderContract
 * @extends {AbstractContract<Role.Provider>}
 */
export interface ProviderContract extends AbstractContract<Role.Provider> {}

/**
 * A contract as user
 *
 * @interface UserContract
 * @extends {AbstractContract<Role.User>}
 */
export interface UserContract extends AbstractContract<Role.User> {
  /**
   * In addition to provider's {@link idAddress} (contractor) user needs a unique provider name for contract utilization
   *
   * Can be null as providername may be retrieved asyncrhonously
   *
   * @type {(string | null)}
   * @memberof UserContract
   */
  providerName: ProviderName | null
}

/**
 * The Imprinting contract
 *
 * @interface ImprintingContract
 * @extends {ProviderContract}
 */
export interface ImprintingContract extends ProviderContract {
  imprinting: true
}

/**
 * The Orchestration contract
 *
 * @interface OrchestrationContract
 * @extends {ProviderContract}
 */
export interface OrchestrationContract extends ProviderContract {
  orchestration: true
}
export type Contract = UserContract | ProviderContract
