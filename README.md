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
  broker, // {string} url of the mqtt broker host (e.g. tcp://192.168.0.108:1883)
  bcSeeds, // {string[]} array of string ips 
  registryUrl, // {string} the url of the UQ registry (e.g. http://192.168.0.108:8080)
  requestTimeout, // {number} millis to wait before an RPC request times out
  rpcHandlers, // an array of handlers object
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
