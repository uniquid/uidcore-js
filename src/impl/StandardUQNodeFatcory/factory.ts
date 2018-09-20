import * as path from 'path'
import { makeBcoinCEV, Options as CEVOpts } from '../Bcoin/BcoinCEV'
import { fromHTTPRegistry } from '../Bcoin/BcoinCEV/providerNameResolvers/httpRegistry'
import { makeBcoinDB } from '../Bcoin/BcoinDB'
import { makeBcoinID } from '../Bcoin/BcoinID'
import { BcoinDB } from '../Bcoin/types/BcoinDB'
import { BcoinID } from '../Bcoin/types/BcoinID'
import { makeRPC } from '../RPC/BitmaskBcoin/RPC'
import { RPCHandler } from '../RPC/BitmaskBcoin/types'
import { messages, Messages } from './message'
import { getNodeName } from './nodename'

export interface Config {
  home: string
  mqttHost: string
  bcSeeds: string[]
  rpcHandlers: RPCHandler[]
  registryUrl: string
  requestTimeout?: number
  announceTopic?: string
  nodenamePrefix?: string
  network: CEVOpts['network']
}
export interface StdUQNode {
  msgs: Messages
  id: BcoinID
  db: BcoinDB
}
export const DEFAULT_ANNOUNCE_TOPIC = 'UIDLitecoin/announce'
export const DEFAULT_RPC_TIMEOUT = 10000
export const standardUQNodeFactory = ({
  home,
  mqttHost,
  bcSeeds,
  rpcHandlers,
  registryUrl,
  requestTimeout = DEFAULT_RPC_TIMEOUT,
  announceTopic = DEFAULT_ANNOUNCE_TOPIC,
  nodenamePrefix = '',
  network
}: Config): Promise<StdUQNode> => {
  console.log(mqttHost, announceTopic, bcSeeds, registryUrl)
  const dbOpts = { home: path.join(home, 'DB') }
  const dbProm: Promise<BcoinDB> = makeBcoinDB(dbOpts)

  const idOpts = { home: path.join(home, 'ID') }
  const idProm: Promise<BcoinID> = makeBcoinID(idOpts)

  return Promise.all([dbProm, idProm]).then(([db, id]) => {
    const cevOpts: CEVOpts = {
      home: path.join(home, 'CEV'),
      logLevel: 'debug',
      seeds: bcSeeds,
      watchahead: 10,
      providerNameResolver: fromHTTPRegistry(registryUrl),
      network
    }
    const nodenameOpts = { home: path.join(home, 'NODENAME'), prefix: nodenamePrefix }
    const nodename = getNodeName(nodenameOpts)
    const announceMessage = { topic: announceTopic, data: { name: nodename, xpub: id.getBaseXpub() } }
    const cev = makeBcoinCEV(db, id, cevOpts)
    const rpc = makeRPC(cev, db, id)
    const { identityFor } = id
    const msgs: Messages = messages({ identityFor, announceMessage, mqttHost, rpc, rpcHandlers, requestTimeout })

    return {
      msgs,
      cev,
      id,
      db,
      nodename
    }
  })
}
