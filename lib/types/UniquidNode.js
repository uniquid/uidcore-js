export var UniquidNodeState;
(function (UniquidNodeState) {
    /**
     * Represents a node just created. The node contains the ID-based cryptography but it is not yet initialized.
     */
    UniquidNodeState[UniquidNodeState["CREATED"] = 0] = "CREATED";
    /**
     * Represents a node initialized and waiting for the Imprinting transaction.
     */
    UniquidNodeState[UniquidNodeState["IMPRINTING"] = 1] = "IMPRINTING";
    /**
     * Represents a node ready to use.
     */
    UniquidNodeState[UniquidNodeState["READY"] = 2] = "READY";
})(UniquidNodeState || (UniquidNodeState = {}));
//# sourceMappingURL=UniquidNode.js.map