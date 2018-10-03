import { Request } from '../../RPC/BitmaskBcoin/types';
export interface Message<Topic extends string, M> {
    topic: Topic;
    data: M;
}
export interface AnnounceData {
    name: string;
    xpub: string;
}
export declare type AnnounceMessage = Message<string, AnnounceData>;
export declare type RPCMessage = Message<string, Request>;
