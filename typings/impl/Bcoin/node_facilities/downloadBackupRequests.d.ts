export declare function downloadBackups({ blockNumber, network, host }: DownloadConfig): {
    db: any;
    md5: any;
};
export declare function getBackupFilenames({ blockNumber, network, host }: FilenamesConfig): {
    dbFileUrl: string;
    md5FileUrl: string;
};
export interface FilenamesConfig {
    blockNumber: number | false;
    network: string;
    host: string;
}
export interface DownloadConfig extends FilenamesConfig {
}
