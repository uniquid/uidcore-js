import { Options as CEVOpts } from '../Bcoin/BcoinCEV';
import { BcoinDB } from '../Bcoin/types/BcoinDB';
import { BcoinID } from '../Bcoin/types/BcoinID';
import { RPCHandler } from '../RPC/BitmaskBcoin/types';
import { Messages } from './message';
export interface Config {
    home: string;
    mqttHost: string;
    bcSeeds: string[];
    rpcHandlers: RPCHandler[];
    registryUrl: string;
    requestTimeout?: number;
    announceTopic?: string;
    nodenamePrefix?: string;
    network: CEVOpts['network'];
}
export interface StdUQNode {
    msgs: Messages;
    id: BcoinID;
    db: BcoinDB;
}
export declare const DEFAULT_ANNOUNCE_TOPIC = "UIDLitecoin/announce";
export declare const DEFAULT_RPC_TIMEOUT = 10000;
export declare const standardUQNodeFactory: ({ home, mqttHost, bcSeeds, rpcHandlers, registryUrl, requestTimeout, announceTopic, nodenamePrefix, network }: Config) => Promise<StdUQNode>;
