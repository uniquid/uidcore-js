/// <reference types="node" />
import { AbstractIdentity, Identity, Role } from '../../../types/data/Identity';
import { BcoinAbstractIdentity, BcoinIdentity } from './../types/data/BcoinIdentity';
export declare type AbstractIdentity<R extends Role> = AbstractIdentity<R>;
export declare type Identity<R extends Role> = Identity<R>;
export declare type Bip32Base58PrivKey = string;
export declare type Bip32Base58PubKey = string;
export declare type Base58Address = string;
export declare type BcoinHDPrivateKey = {
    privateKey: PrivateKey;
    toBase58(): Bip32Base58PrivKey;
    toPublic(): BcoinHDPublicKey;
    derivePath(path: string): BcoinHDPrivateKey;
};
export declare type BcoinHDPublicKey = {
    publicKey: PublicKey;
    toBase58(): Bip32Base58PubKey;
};
export declare type PublicKey = Buffer;
export declare type PrivateKey = Buffer;
export declare type HDPath = (string)[];
export declare const signFor: (bip32ExtMasterPrivateKey: string) => (abstrId: BcoinAbstractIdentity<Role>, hash: Buffer, der?: boolean) => Buffer;
export declare const getImprintingAddress: (bip32ExtMasterPrivateKey: string) => () => string;
export declare const getOrchestrateAddress: (bip32ExtMasterPrivateKey: string) => () => string;
export declare const getBaseXpub: (bip32ExtMasterPrivateKey: string) => () => string;
export declare const publicKeyAtPath: (bip32ExtMasterPrivateKey: string) => (path: string[]) => Buffer;
export declare const identityFor: (bip32ExtMasterPrivateKey: string) => <R extends Role>(abstrId: BcoinAbstractIdentity<R>) => BcoinIdentity<R>;
export declare const signMessage: (bip32ExtMasterPrivateKey: string) => (message: string, abstractIdentity: BcoinAbstractIdentity<Role>) => Buffer;
export declare const recoverAddress: (bip32ExtMasterPrivateKey: string) => (message: string, signature: string) => any;
export declare const verifyMessage: (bip32ExtMasterPrivateKey: string) => (message: string, signature: string) => string | null;
