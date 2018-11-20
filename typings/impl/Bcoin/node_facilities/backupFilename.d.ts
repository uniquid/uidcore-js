export interface Config {
    blockNumber: number | false;
    network: string;
    host: string;
}
export declare const getBackupFilenames: ({ blockNumber, network, host }: Config) => {
    dbFileUrl: string;
    md5FileUrl: string;
};
