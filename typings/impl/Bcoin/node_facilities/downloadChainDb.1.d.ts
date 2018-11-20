import request from 'request';
export interface Config {
    atBlock: number | false;
    network: string;
    host: string;
}
export declare const importDb: ({ atBlock, network, host }: Config) => request.Request;
