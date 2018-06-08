export declare const NAME_LENGTH = 12;
export declare const generateUniqueName: (prefix?: string) => string;
export declare const NODE_NAME_FILE = "node.name";
export interface Config {
    home: string;
    prefix?: string;
}
export declare const getNodeName: (config: Config) => string;
