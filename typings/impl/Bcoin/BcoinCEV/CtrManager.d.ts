/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { IdAddress } from '../../../types/data/Identity';
import { BCPool } from './../BcoinCEV/Pool';
import { BcoinDB } from './../types/BcoinDB';
import { BcoinID } from './../types/BcoinID';
export declare type ProviderNameResolver = (providerAddress: IdAddress) => Promise<string>;
/**
 * This starts the {@link BcoinCEV} main lifecycle process,
 * when started it ensures node imprinting contract, then ensures node orchestration contract
 *
 * Ensureness is guaranteed by the presence of contracts in the {@link BcoinDB} persistence
 * if not present pool should watch on respective {@link IdAddress addresses} waiting for contracts to come
 *
 * Then it loops in watching for node's user and provider {@link IdAddress}es for respective {@link Contract}s
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {BCPool} pool a BCPool instance
 * @param {number} watchahead how many {@link IdAddress} to watch ahead the latest BIP32 index on user and provider {@link Contract}
 * @param {ProviderNameResolver} providerNameResolver
 */
export declare const startContractManager: (db: BcoinDB, id: BcoinID, pool: BCPool, watchahead: number, providerNameResolver: ProviderNameResolver, logger: any) => Promise<void>;
