import { Identity } from '../../../../types/data/Identity';
import { BcoinIdentity } from '../../types/data/BcoinIdentity';
import { BCTX } from '../Pool';
import { Contract, ImprintingContract, OrchestrationContract } from './../../../../types/data/Contract';
import { Role } from './../../../../types/data/Identity';
/**
 * Checks and converts raw Bcoin {@link BCTX transactions} into valid {@link Contract}s
 *
 * @param {Identity<Role>[]} identities
 * @param {BCTX[]} rawBcoinTxs
 */
export declare const getRoleContracts: (identities: Identity<Role>[], rawBcoinTxs: BCTX[]) => Contract[];
/**
 * Attempt to find a {@link ImprintingContract} representation in raw Bcoin {@link BCTX transactions}
 *
 * Converts it into valid {@link ImprintingContract}
 *
 * @param {IdAddress} imprintingAddress
 * @param {BCTX[]} rawBcoinTxs
 * @returns {(ImprintingContract | void)} an {@link ImprintingContract} or undefined if not present
 */
export declare const convertToImprintingContract: (imprintingAddress: string, rawBcoinTxs: BCTX[]) => void | ImprintingContract;
/**
 * Attempt to find a {@link OrchestrationContract} representation in raw Bcoin {@link BCTX transactions}
 *
 * Converts it into valid {@link OrchestrationContract}
 *
 * @param {ImprintingContract} imprintingContract
 * @param {IdAddress} imprintingAddress
 * @param {BCTX[]} rawBcoinTxs
 * @returns {(OrchestrationContract | void)} an {@link OrchestrationContract} or undefined if not present
 */
export declare const convertToOrchestrationContract: (imprintingContract: ImprintingContract, orchestrationAddress: string, rawBcoinTxs: BCTX[]) => void | OrchestrationContract;
/**
 * converts a raw Bcoin {@link BCTX transaction} into a valid {@link Contract} for the given {@link BcoinIdentity<Role> identity}
 *
 *
 * @param {BcoinIdentity<Role>} identity
 * @param {BCTX} rawBcoinTx
 * @returns {Contract}
 */
export declare const convertToRoleContract: (identity: BcoinIdentity<Role>, rawBcoinTx: BCTX) => Contract;
/**
 * filter the {@link IdAddress[] revoking addresses} against {@link BCTX[] raw Bcoin transactions} provided
 *
 * A revoking address present in any input of the provided transactions is considered as a revoking act
 *
 * @param {IdAddress[]} revokingAddresses
 * @param {BCTX[]} rawBcoinTxs
 * @returns {IdAddress[]} revoker's {@link IdAddress[] addresses} found in inputs are returned
 */
export declare const getRevokingAddresses: (revokingAddresses: string[], rawBcoinTxs: BCTX[]) => string[];
export declare const isContractTX: (orchestration?: boolean) => (tx: BCTX) => boolean;
export declare const isImprintingTX: (imprintingAddress: string) => (rawBcoinTx: BCTX) => boolean;
export declare const isOrchestrationTX: (orchestrationAddress: string, imprintingAddress: string) => (rawBcoinTx: BCTX) => boolean;
export declare const getProviderAddress: (rawBcoinTx: BCTX) => string;
export declare const getUserAddress: (rawBcoinTx: BCTX) => string;
export declare const getPayload: (rawBcoinTx: BCTX) => number[];
export declare const getRevokerAddress: (rawBcoinTx: BCTX) => string;
export declare const getChangeAddress: (rawBcoinTx: BCTX) => string;
