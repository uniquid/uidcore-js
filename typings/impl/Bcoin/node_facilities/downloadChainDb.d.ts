export interface Config {
    atBlock: number;
    saveToAbsoluteDir: string;
    renameTo?: string;
    network?: string;
}
export declare const importDb: ({ atBlock, saveToAbsoluteDir, renameTo, network }: Config) => void;
