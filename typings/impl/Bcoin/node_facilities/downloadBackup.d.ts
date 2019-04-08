export default downloadBackup;
export declare function downloadBackup(_: {
    blockNumber: number | void;
    network: string;
    host: string;
    saveAs?: string;
}): Promise<{
    checksumFile: string;
    backupFile: string;
}>;
export declare function getBackupFilename({blockNumber, network}: {
    blockNumber: number | void;
    network: string;
}): string;
