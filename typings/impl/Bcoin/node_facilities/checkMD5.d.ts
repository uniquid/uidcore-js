export interface Config {
    checksumFile: string;
    backupFile: string;
}
export declare function checkBackupFileMD5({ checksumFile, backupFile }: Config): Promise<boolean>;
