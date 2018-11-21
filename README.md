# Uniquid JS Library

## Requirements
- Node 8

## Getting started
install dependecy
`npm i -S git+https://github.com/uniquid/uidcore-js.git`

sample code:

```javascript
import { standardUQNodeFactory } from '@uniquid/uidcore/lib'

// create some handlers for bitmask rpc over mqtt
const RPC_METHOD_ECHO = 34
const rpcHandlers  = [
 {
   m: RPC_METHOD_ECHO,  // the bit number associated to method
   h: (params /*string*/) => `ECHO: ${params}`  // function to call when bitmask method is invoked
 }
]

// Use standard UQ node factory to create an UQ Node:
standardUQNodeFactory({
  home, // {string} path to the home folder for data persistence (folder must exist)
  mqttHost, // {string} url of the mqtt broker host (e.g. tcp://192.168.0.108:1883)
  bcSeeds, // {string[]} array of string ips
  registryUrl, // {string} the url of the UQ registry (e.g. http://192.168.0.108:8080)
  requestTimeout, // {number} millis to wait before an RPC request times out
  rpcHandlers, // an array of handlers object
  bcLogLevel, // {string} log level for the underlying LCoin process can be "error" | "warning" | "info" | "debug" | "spam"
  network, // {string} choose bc network "uqregtest" | "main" | "testnet"
  nodenamePrefix: 'My-Node-'
})
.then(uq => {
  // as a User make a request to a Provider bound by a UQ contract
  uq.msgs.request(
    userAddress, // string : BC adrress of node user
    providerName, // string : provider's unique name
    method, // number : method number
    params // string : serialized params for rpc
  ).then(
    responseString => {
      // manage response
    },
    error => {
      // manage error
    })

},
error => {
  // initialization error
})

```

### ltc-backup CLI tool

`ltc-backup` CLI tool will help you speed up development and UQ node startup time, downloading a LTC header's backup from UniquId's servers and injecting it for UniquId node usage.
It will be available in any package that installs `@uniquid/uidcore`
Perform it using `npx ltc-backup [options] [command]`
Checkout helps in CLI

```
$ npx ltc-backup --help
$ npx ltc-backup download --help
$ npx ltc-backup inject --help
$ npx ltc-backup install --help
```

#### Intro
Starting up a blockchain node is a time-consuming task, the newly created node requires to download the whole header chain from the network.

For speeding up this task in test and development environment it is possible to inject a pre-populated DB into the node's home directory

When Node start it is configured with a node home directory for node persistency
the process structures the directory this way:
```
<node_home>/
    CEV/
        chain.db.ldb/ <-- this is the blockchain headers (leveldb)DB directory
    ID/
    DB/
```

If the process finds some resources present in the directory, it will use them.

So, letting the node find a valid and pre-populated CEV/chain.db.ldb into its home directory will let the node use it and start syncing from there, as long as the node and the DB-backup refer to the same network.

Any chain.db.ldb created with any UQ node is valid and can be imported in any other node, as it is not bound to node's identity.

#### Uniquid Chain DB Backups repo

Uniquid currently provides a set of CEV/chain.db.ldb backups for speeding up development, test, and evaluation.

Download of DB backup TARs is possible at url:

http://35.180.120.244/{network_name}_db_latest.tar
along with a checksum file
http://35.180.120.244/{network_name}_db_latest.tar_md5
for checksum verification

i.e.  http://35.180.120.244/testnet_db_latest.tar and http://35.180.120.244/testnet_db_latest.tar_md5

Previous backups are also present in http://35.180.120.244/{network_name}/db_{block_number}.tar

i.e. http://35.180.120.244/testnet/db_000700000.tar and http://35.180.120.244/testnet/db_000700000.tar_md5

Feel free to navigate with your browser to http://35.180.120.244 and checkout contents


