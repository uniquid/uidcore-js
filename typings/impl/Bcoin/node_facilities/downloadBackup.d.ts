export default downloadBackup;
export declare function downloadBackup(_: {
    blockNumber: number | void;
    network: string;
    host: string;
    saveAs?: string;
}): Promise<void>;
export declare function getBackupFilename({ blockNumber, network }: {
    blockNumber: number | void;
    network: string;
}): string;
export declare function checkBackupFileMD5({ checksumFile, backupFile }: {
    checksumFile: string;
    backupFile: string;
}): Promise<void>;
