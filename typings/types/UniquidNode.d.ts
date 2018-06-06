export interface UniquidNode {
    /**
     * Returns the imprinting address of this node
     *
     * @return a Promise for imprinting address of this node
     */
    getImprintingAddress(): Promise<string>;
    /**
     * Returns the public key of this node
     *
     * @return a Promise for public key of this node
     */
    getPublicKey(): Promise<string>;
    /**
     * Returns the node name
     *
     * @return a Promise for the name of this node
     */
    getNodeName(): Promise<string>;
    /**
     * Returns the creation time of this node
     *
     * @return a Promise for creation time of this node
     */
    getCreationTime(): Promise<number>;
    /**
     * Return the spendable balance of this node
     *
     * @return a Promise for the spendable balance of this node
     */
    getSpendableBalance(): Promise<string>;
    /**
     * Initialize this node
     * @return a Promise for fullfillment
     */
    initNode(): Promise<void>;
    /**
     * Synchronize the node against the BlockChain.
     * @return a Promise for fullfillment
     */
    updateNode(): Promise<void>;
    /**
     * Returns the current state of this node.
     *
     * @return a Promise for the UniquidNodeState representing the current state of this node.
     */
    getNodeState(): Promise<UniquidNodeState>;
    /**
     * Allow to sign an unsigned serialized blockchain transaction.
     *
     * @param serializedTx the unsigned serialized transaction to sign
     * @param path the bip32 path to use to sign
     * @return a Promise for the serialized signed transaction
     * in case a problem occurs.
     */
    signTransaction(serializedTx: string, paths: string[]): Promise<string>;
    /**
     * Sign the input message with the key derived from path specified
     *
     * @param message the message to sign
     * @param path the path to use to derive HD key
     * @return a Promise for the message signed with the derived HD key
     * in case a problem occurs.
     */
    signMessage(message: string, path: string): Promise<string>;
    /**
     * Allow to propagate a serialized Tx on the peer2peer network
     * @param serializedTx
     * @return a Promise for
     */
    broadCastTransaction(serializedTx: string): Promise<string>;
}
export declare enum UniquidNodeState {
    /**
     * Represents a node just created. The node contains the ID-based cryptography but it is not yet initialized.
     */
    CREATED = 0,
    /**
     * Represents a node initialized and waiting for the Imprinting transaction.
     */
    IMPRINTING = 1,
    /**
     * Represents a node ready to use.
     */
    READY = 2,
}
