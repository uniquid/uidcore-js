
export interface UniquidNode {

	/**
	 * Returns the imprinting address of this node
	 *
	 * @return imprinting address of this node
	 */
  getImprintingAddress(): string;

	/**
	 * Returns the public key of this node
	 *
	 * @return public key of this node
	 */
  getPublicKey(): string;

	/**
	 * Returns the node name
	 *
	 * @return the name of this node
	 */
  getNodeName(): string;

	/**
	 * Returns the creation time of this node
	 *
	 * @return creation time of this node
	 */
  getCreationTime(): number;

	/**
	 * Return the spendable balance of this node
	 *
	 * @return the spendable balance of this node
	 */
  getSpendableBalance(): string;

	/**
	 * Initialize this node
	 */
  initNode(): void;

	/**
	 * Synchronize the node against the BlockChain.
	 */
  updateNode(): void;

	/**
	 * Returns the current state of this node.
	 *
	 * @return the {@code UniquidNodeState} representing the current state of this node.
	 */
  getNodeState(): UniquidNodeState;

	/**
	 * Allow to sign an unsigned serialized blockchain transaction.
	 *
	 * @param serializedTx the unsigned serialized transaction to sign
	 * @param path the bip32 path to use to sign
	 * @return the serialized signed transaction
	 * in case a problem occurs.
	 */
  signTransaction(serializedTx: string, paths: string[]): string;

	/**
	 * Sign the input message with the key derived from path specified
	 *
	 * @param message the message to sign
	 * @param path the path to use to derive HD key
	 * @return the message signed with the derived HD key
	 * in case a problem occurs.
	 */
  signMessage(message: string, path: string): string;

	// /**
	//  * Sign the input message with the private key corresponding to the public key hash specified
	//  *
	//  * @param message the message to sign
	//  * @param pubKeyHash the hash of the corresponding public key
	//  * @return the message signed with the derived HD key
	//  * in case a problem occurs.
	//  */
  // signMessage(message: string, pubKeyHash: Buffer ): string;

	// /**
	//  * Register an event listener
	//  *
	//  * @param uniquidNodeEventListener the event listener that will receive callbacks
	//  */
  // addListener(event: string, listener: Function): () => void;

	/**
	 * Allow to propagate a serialized Tx on the peer2peer network
	 * @param serializedTx
	 * @return
	 * */
  broadCastTransaction(serializedTx: string): string;

}

export enum UniquidNodeState {

	/**
	 * Represents a node just created. The node contains the ID-based cryptography but it is not yet initialized.
	 */
	CREATED,

	/**
	 * Represents a node initialized and waiting for the Imprinting transaction.
	 */
	IMPRINTING,

	/**
	 * Represents a node ready to use.
	 */
	READY

}
