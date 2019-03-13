/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import * as path from 'path'
import { makeBcoinCEV, Options as CEVOpts } from '../Bcoin/BcoinCEV'
import { fromHTTPRegistry } from '../Bcoin/BcoinCEV/providerNameResolvers/httpRegistry'
import { makeBcoinDB } from '../Bcoin/BcoinDB'
import { makeBcoinID, Options as IDOptions } from '../Bcoin/BcoinID'
import { BcoinCEV } from '../Bcoin/types/BcoinCEV'
import { BcoinDB } from '../Bcoin/types/BcoinDB'
import { BcoinID } from '../Bcoin/types/BcoinID'
import { makeRPC } from '../RPC/BitmaskBcoin/RPC'
import { RPCHandler } from '../RPC/BitmaskBcoin/types'
import { messages, Messages } from './message'
import { getNodeName } from './nodename'
// tslint:disable-next-line:no-require-imports
const bcoin = require('lcoin')

export interface Config {
  home: string
  mqttHost: string
  bcSeeds: string[]
  rpcHandlers: RPCHandler[]
  registryUrl: string
  requestTimeout?: number
  announceTopic?: string
  nodenamePrefix?: string
  bcLogLevel: CEVOpts['logLevel']
  network: IDOptions['network']
}
export interface StdUQNode {
  msgs: Messages
  id: BcoinID
  db: BcoinDB
  cev: BcoinCEV
  nodename: string
}
export const DEFAULT_ANNOUNCE_TOPIC = 'UIDLitecoin/announce'
export const DEFAULT_RPC_TIMEOUT = 10000
export const standardUQNodeFactory = async ({
  home,
  mqttHost,
  bcSeeds,
  rpcHandlers,
  registryUrl,
  requestTimeout = DEFAULT_RPC_TIMEOUT,
  announceTopic = DEFAULT_ANNOUNCE_TOPIC,
  nodenamePrefix = '',
  network,
  bcLogLevel = 'info'
}: Config): Promise<StdUQNode> => {
  const logger = new bcoin.logger({
    level: bcLogLevel,
    filename: path.join(home, 'log')
  })
  await logger.open()

  const dbOpts = { home: path.join(home, 'DB') }
  const dbProm: Promise<BcoinDB> = makeBcoinDB(dbOpts)

  const idOpts = { home: path.join(home, 'ID'), network }
  const idProm: Promise<BcoinID> = makeBcoinID(idOpts)

  return Promise.all([dbProm, idProm]).then(async ([db, id]) => {
    const cevOpts: CEVOpts = {
      home: path.join(home, 'CEV'),
      logLevel: bcLogLevel,
      seeds: bcSeeds,
      watchahead: 10,
      providerNameResolver: fromHTTPRegistry(registryUrl),
      logger
    }
    const nodenameOpts = {
      home: path.join(home, 'NODENAME'),
      prefix: nodenamePrefix
    }
    const nodename = getNodeName(nodenameOpts)
    const announceMessage = {
      topic: announceTopic,
      data: { name: nodename, xpub: id.getBaseXpub() }
    }
    const cev = await makeBcoinCEV(db, id, cevOpts)
    const rpc = makeRPC(cev, db, id)
    const { identityFor } = id
    const msgs: Messages = messages({
      identityFor,
      announceMessage,
      mqttHost,
      rpc,
      rpcHandlers,
      requestTimeout,
      logger
    })

    return {
      msgs,
      cev,
      id,
      db,
      nodename
    }
  })
}
