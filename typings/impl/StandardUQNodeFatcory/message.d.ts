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
export declare type MessagePublish = (msg: Msg.Message<string, any>) => Promise<void>;
export declare type MessageRequest = (userAddress: string, providerName: string, method: number, params: string) => Promise<Response>;
export interface Messages {
    publish: MessagePublish;
    request: MessageRequest;
}
export declare const messages: ({ announceMessage, mqttHost, rpc, rpcHandlers, requestTimeout }: Config) => {
    publish: (msg: Msg.Message<string, any>) => Promise<void>;
    request: (userAddress: string, providerName: string, method: number, params: string) => Promise<Response>;
};
