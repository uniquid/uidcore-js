import { ID } from '../../types/layers/ID';
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
}
export interface Messages {
    publish(msg: Msg.Message<string, any>): Promise<void>;
    request(userAddress: string, providerName: string, method: number, params: string): Promise<Response>;
}
export declare const messages: ({ announceMessage, mqttHost, rpc, rpcHandlers, requestTimeout }: Config) => {
    publish: (msg: Msg.Message<string, any>) => Promise<void>;
    request: (userAddress: string, providerName: string, method: number, params: string) => Promise<Response>;
};
