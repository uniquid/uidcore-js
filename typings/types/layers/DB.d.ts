/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Contract, ImprintingContract, OrchestrationContract, Payload, ProviderContract } from '../data/Contract';
import { AbstractIdentity, IdAddress, Role } from '../data/Identity';
import { UserContract } from './../data/Contract';
/**
 * The Database Layer
 *
 * offers functionalities for persistence, query and updates of node's contracts
 *
 * @interface DB
 * @export
 */
export interface DB {
    /**
     * Persists the imprinting Contract
     *
     * @param {ImprintingContract} ctr
     * @memberof DB
     */
    storeImprinting(ctr: ImprintingContract): void;
    /**
     * Gets the imprinting Contract
     *
     * @returns {(ImprintingContract | void)} null if not present
     * @memberof DB
     */
    getImprinting(): ImprintingContract | void;
    /**
     * Persists the orchestration Contract
     *
     *
     * @param {OrchestrationContract} ctr
     * @memberof DB
     */
    storeOrchestration(ctr: OrchestrationContract): void;
    /**
     * Gets the orchestration Contract
     *
     * @returns {(OrchestrationContract | void)} null if not present
     * @memberof DB
     */
    getOrchestration(): OrchestrationContract | void;
    /**
     * Persists a Contract
     *
     * @param {Contract} ctr
     * @memberof DB
     */
    storeCtr(ctr: Contract): void;
    /**
     * Gets latest stored UserContract Identity
     *
     * @returns {AbstractIdentity<Role.User>}
     * @memberof DB
     */
    getLastUserContractIdentity(): AbstractIdentity<Role.User>;
    /**
     * Gets latest stored ProviderContract Identity
     *
     * @returns {AbstractIdentity<Role.Provider>}
     * @memberof DB
     */
    getLastProviderContractIdentity(): AbstractIdentity<Role.Provider>;
    /**
     * Gets all active contracts
     *
     * @returns {Contract[]}
     * @memberof DB
     */
    getActiveRoleContracts(): Contract[];
    /**
     * Gets all contracts
     *
     * @returns {Contract[]}
     * @memberof DB
     */
    getAllRoleContracts(): Contract[];
    /**
     * Gets all User contracts
     *
     * @returns {UserContract[]}
     * @memberof DB
     */
    getAllUserContracts(): UserContract[];
    /**
     * Gets all Provider contracts
     *
     * @returns {ProviderContract[]}
     * @memberof DB
     */
    getAllProviderContracts(): ProviderContract[];
    /**
     * revokes contract whose revoker is revokerAddress
     *
     * @param {IdAddress} revokerAddress the contract's revoker address
     * @memberof DB
     */
    revokeContract(revokerAddress: IdAddress): void;
    /**
     * gets the payload for the abstractId's contract, or undefined if not present
     *
     * @param {AbstractIdentity<Role>} abstractId
     * @returns {(Payload | void)}
     * @memberof DB
     */
    getPayload(abstractId: AbstractIdentity<Role>): Payload | void;
    /**
     * gets the ProviderContract whose contractor (user) is userAddress, or undefined if not present
     *
     * @param {IdAddress} userAddress
     * @returns {(ProviderContract | void)}
     * @memberof DB
     */
    getContractForExternalUser(userAddress: IdAddress): ProviderContract | void;
    /**
     * retrieves all UserContracts whome providerName is not valued useful for async resolved providerNAmes
     *
     * @returns {UserContract[]}
     * @memberof DB
     */
    findContractsWithUnresolvedProviderNames(): UserContract[];
    /**
     * retrieves active UserContracts whome providerName is {providerName}
     *
     * @param {string} providerName
     * @returns {UserContract[]}
     * @memberof DB
     */
    findUserContractsByProviderName(providerName: string): UserContract[];
    /**
     * updates a contract setting providerName on UserContract having providerAddress' contractor
     *
     * @param {IdAddress} providerAddress
     * @param {string} providerName
     * @memberof DB
     */
    setProviderName(providerAddress: IdAddress, providerName: string): void;
}
