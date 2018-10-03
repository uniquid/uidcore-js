import { BcoinID } from '../../types/BcoinID';
import { TXObj } from './parse';
export interface SignResult {
    txid: string;
    signedTxObj: TXObj;
}
/**
 * Signs a bitcoin transaction inputs against BIP32 iden(tities at the {@link HDPath paths} specified
 * paths must be relative to UQBasePath ( m/44'/0'0 )
 *
 * @param {BcoinID} id an instance of {@link BcoinID} for actual byte[] signing
 * @param {string} rawtx  a UQ-transaction-compliant-contract as input
 * @param {HDPath[]} paths BIP32 paths forinput signing
 * @returns {SignResult}
 */
export declare const transactionSigner: (id: BcoinID, rawtx: string, paths: string[][]) => SignResult;
