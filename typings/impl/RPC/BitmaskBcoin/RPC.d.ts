import { BcoinCEV } from '../../Bcoin/types/BcoinCEV';
import { BcoinDB } from '../../Bcoin/types/BcoinDB';
import { BcoinID } from '../../Bcoin/types/BcoinID';
import { Handler, Request, Response, SigRequest, SigResponse } from './types';
export interface RPC {
    manageRequest(request: Request | SigRequest): Promise<Response | SigResponse>;
    register(method: number, handler: Handler): Handler | null;
}
export declare const makeRPC: (cev: BcoinCEV, db: BcoinDB, id: BcoinID) => RPC;
