"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const txContracts_1 = require("./TX/txContracts");
const loopRoleContractWatch = async (db, pool, id, watchahead, onContracts) => {
    const _nextWatchIdentities = [db.getLastProviderContractIdentity(), db.getLastUserContractIdentity()]
        .map(lastIdentity => {
        const identities = [];
        for (let offset = 1; offset <= watchahead; offset++) {
            const waIdentity = id.identityFor(Object.assign({}, lastIdentity, { index: lastIdentity.index + offset }));
            identities.push(waIdentity);
        }
        return identities;
    })
        .reduce((a, b) => a.concat(b));
    const nextWatchIdentities = Array.from(new Set(_nextWatchIdentities));
    const nextWatchAddresses = nextWatchIdentities.map(identity => identity.address);
    const watchingRevokingAddresses = db.getActiveRoleContracts().map(ctr => ctr.revoker);
    console.log(`watchingRevokingAddresses: `, watchingRevokingAddresses.reduce((s, a, i) => `${s}\n${i} : ${a}`, ''));
    console.log(`nextWatchAddresses: `, nextWatchAddresses.reduce((s, a, i) => `${s}\n${i} : ${a}`, ''));
    const txs = await pool.watchAddresses(nextWatchAddresses.concat(watchingRevokingAddresses));
    const newContracts = txContracts_1.getRoleContracts(nextWatchIdentities, txs);
    console.log(`\n++NEW Role Contracts: ${newContracts.length} `);
    console.log(newContracts.reduce((s, c) => `${s}${c.identity.role}[${c.identity.index}] -> ${c.contractor}\n`, ''));
    newContracts.forEach(db.storeCtr);
    const revokingAddresses = txContracts_1.getRevokingAddresses(watchingRevokingAddresses, txs);
    console.log(`\n--REVOKING Addresses: ${revokingAddresses.length}`);
    console.log(revokingAddresses.reduce((s, a) => `${s}${a}\n`, ''));
    revokingAddresses.forEach(db.revokeContract);
    onContracts(newContracts, revokingAddresses);
    loopRoleContractWatch(db, pool, id, watchahead, onContracts).catch(err => console.error('loopRoleContractWatch ERROR:', err));
};
const ensureImprinting = async (db, id, pool) => {
    let shallBeImprintingContract = db.getImprinting();
    const imprintingAddress = id.getImprintingAddress();
    console.log(`---------------------------------------------------------- IMPR (${imprintingAddress}) `, shallBeImprintingContract);
    while (!shallBeImprintingContract) {
        const txs = await pool.watchAddresses([imprintingAddress]);
        console.log(`---------------------------------------------------------- got IMPR ${imprintingAddress}`, txs);
        shallBeImprintingContract = txContracts_1.convertToImprintingContract(imprintingAddress, txs);
        if (shallBeImprintingContract) {
            db.storeImprinting(shallBeImprintingContract);
        }
    }
    return shallBeImprintingContract;
};
const ensureOrchestration = (db, id, pool) => async (imprintingContract) => {
    let shallBeOrchestrationContract = db.getOrchestration();
    const orchestrationAddress = id.getOrchestrateAddress();
    while (!shallBeOrchestrationContract) {
        console.log(`---------------------------------------------------------- ORCH (${orchestrationAddress}) `, shallBeOrchestrationContract);
        const txs = await pool.watchAddresses([orchestrationAddress]);
        console.log(`---------------------------------------------------------- got ORCH ${orchestrationAddress}`, txs);
        shallBeOrchestrationContract = txContracts_1.convertToOrchestrationContract(imprintingContract, orchestrationAddress, txs);
        if (shallBeOrchestrationContract) {
            db.storeOrchestration(shallBeOrchestrationContract);
            db.revokeContract(imprintingContract.revoker);
        }
    }
    return shallBeOrchestrationContract;
};
const providerNameProcess = (db, providerNameResolver) => {
    let contractsWithUnresolvedProviderNames = [];
    const trigger = () => {
        contractsWithUnresolvedProviderNames = db.findContractsWithUnresolvedProviderNames();
        next();
    };
    return {
        trigger
    };
    function next() {
        const contract = contractsWithUnresolvedProviderNames.shift();
        if (contract) {
            const providerAddress = contract.contractor;
            providerNameResolver(providerAddress)
                .then(providerName => db.setProviderName(providerAddress, providerName))
                .catch(error => {
                console.error(`ProviderNameResolver [${providerAddress}] Error`, error);
                // tslint:disable-next-line:no-magic-numbers
                setTimeout(trigger, 10000);
            });
        }
    }
};
/**
 * This starts the {@link BcoinCEV} main lifecycle process,
 * when started it ensures node imprinting contract, then ensures node orchestration contract
 *
 * Ensureness is guaranteed by the presence of contracts in the {@link BcoinDB} persistence
 * if not present pool should watch on respective {@link IdAddress addresses} waiting for contracts to come
 *
 * Then it loops in watching for node's user and provider {@link IdAddress}es for respective {@link Contract}s
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {BCPool} pool a BCPool instance
 * @param {number} watchahead how many {@link IdAddress} to watch ahead the latest BIP32 index on user and provider {@link Contract}
 * @param {ProviderNameResolver} providerNameResolver
 */
exports.startContractManager = async (db, id, pool, watchahead, providerNameResolver) => ensureImprinting(db, id, pool).then(ensureOrchestration(db, id, pool)).then(() => {
    const { trigger } = providerNameProcess(db, providerNameResolver);
    loopRoleContractWatch(db, pool, id, watchahead, trigger).catch(err => console.error('loopRoleContractWatch ERROR:', err));
    trigger();
});
//# sourceMappingURL=CtrManager.js.map