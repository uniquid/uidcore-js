import { BcoinCEV } from '../../Bcoin/types/BcoinCEV';
import { BcoinDB } from '../../Bcoin/types/BcoinDB';
import { BcoinID } from '../../Bcoin/types/BcoinID';
import { Handler, Request, Response } from './types';
export interface RPC {
    manageRequest(request: Request): Promise<Response>;
    register(method: number, handler: Handler): Handler | null;
}
export declare const makeRPC: (cev: BcoinCEV, db: BcoinDB, id: BcoinID) => RPC;
