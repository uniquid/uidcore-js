// tslint:disable-next-line:no-require-imports
const Pool = require('bitcore-p2p').Pool
// tslint:disable-next-line:no-require-imports
const testnet: Network = require('bitcore-lib').Networks.testnet

export interface Network {
  name: string
  alias: string
  pubkeyhash: number
  privatekey: number
  scripthash: number
  xpubkey: number
  xprivkey: number
  networkMagic: number
  port: number
}
export interface Addr {
  ip: string
  port: number
}
export const UQPeer = (peers: (string | Addr)[], network = testnet) => {
  const addrs = peers.map(elem => ('string' === typeof elem ? { ip: elem, port: network.port } : elem))
  const pool = new Pool({
    network,
    dnsSeed: false,
    listenAddr: false,
    addrs,
  })
  // the network object
  // prevent seeding with DNS discovered known peers upon connecting
  // prevent new peers being added from addr messages

  return pool
}
