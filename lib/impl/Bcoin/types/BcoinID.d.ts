/// <reference types="node" />
import { Role } from '../../../types/data/Identity';
import { ID } from '../../../types/layers/ID';
import { HDPath, PublicKey } from '../BcoinID/HD';
import { BcoinAbstractIdentity } from './data/BcoinIdentity';
/**
 * An ID extended implementation for Bitcoin BIP32 Identity
 * adds 2 Bitcoin specific methods and overloads signFor
 * any key-derivation-related method will derive sub keys starting from the base path: m/44'/0'0
 *
 * @interface BcoinID
 * @extends {ID}
 */
export interface BcoinID extends ID {
    /**
     * ID.signFor overloading, takes an optional der argument
     * if der is true bytes are DER signed
     *
     * @param {BcoinAbstractIdentity<Role>} abstrId
     * @param {Buffer} bytes
     * @param {boolean} [der]
     * @returns {Buffer}
     * @memberof BcoinID
     */
    signFor(abstrId: BcoinAbstractIdentity<Role>, bytes: Buffer, der?: boolean): Buffer;
    /**
     * retrieve public key for a bip 32 path ( starting from the base path: m/44'/0'0 )
     *
     * @param {HDPath} path
     * @returns {PublicKey}
     * @memberof BcoinID
     */
    publicKeyAtPath(path: HDPath): PublicKey;
    /**
     * retrieve base58 public key at base path ( m/44'/0'0 )
     *
     * @returns {string}
     * @memberof BcoinID
     */
    getBaseXpub(): string;
    /**
     * sign a message with Lite(Bit)Coni algorithm
     * against the PK for abstractIdentity
     *
     * @param {string} message
     * @param {BcoinAbstractIdentity<Role>} abstractIdentity
     * @returns {Buffer}
     * @memberof BcoinID
     */
    signMessage(message: string, abstractIdentity: BcoinAbstractIdentity<Role>): Buffer;
}
