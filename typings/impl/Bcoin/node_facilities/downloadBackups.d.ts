import request from 'request';
export declare function downloadBackups({ blockNumber, network, host }: DownloadConfig): {
    db: request.Request;
    md5: request.Request;
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
