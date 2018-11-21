export default checkBackupFileMD5;
export declare function checkBackupFileMD5({ checksumFile, backupFile }: {
    checksumFile: string;
    backupFile: string;
}): Promise<{
    checksumFile: string;
    backupFile: string;
}>;
