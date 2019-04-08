import { Role } from '../../types/data/Identity';
import { ID } from '../../types/layers/ID';
import { BcoinID } from '../Bcoin/types/BcoinID';
import { BcoinAbstractIdentity } from '../Bcoin/types/data/BcoinIdentity';
import { RPC } from '../RPC/BitmaskBcoin/RPC';
import { Response, RPCHandler } from '../RPC/BitmaskBcoin/types';
import * as Msg from './message/Defs';
export interface Config {
    announceMessage: Msg.AnnounceMessage;
    mqttHost: string;
    rpc: RPC;
    rpcHandlers: RPCHandler[];
    requestTimeout: number;
    identityFor: ID['identityFor'];
    logger: any;
}
export declare type MessagePublish = (msg: Msg.Message<string, any>) => Promise<void>;
export declare type MessageRequest = (uqId: BcoinID, cIdentity: BcoinAbstractIdentity<Role>, userAddress: string, providerName: string, method: number, params: string) => Promise<Response>;
export interface Messages {
    publish: MessagePublish;
    request: MessageRequest;
}
export declare const messages: ({ announceMessage, mqttHost, rpc, rpcHandlers, requestTimeout, logger }: Config) => {
    publish: (msg: Msg.Message<string, any>) => Promise<void>;
    request: (uqId: BcoinID, cIdentity: BcoinAbstractIdentity<Role>, userAddress: string, providerName: string, method: number, params: string) => Promise<Response>;
};
