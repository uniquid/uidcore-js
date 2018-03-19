import { CREATED, CreatedNode, NodeInfo } from './data/NodeInfo'
import { DB } from './layers/DB'
import { ID } from './layers/ID'
import { RPC } from './layers/RPC'

export interface Options {
  name: string
}

const creationNodeInfo = (opts: Options): CreatedNode => ({
  name: opts.name,
  createdAt: Number(new Date()),
  state: CREATED,
  lastUserId: null,
  lastProviderId: null,
})

// tslint:disable-next-line:no-magic-numbers
const randomName = () => `JSNode[${Math.random().toString(36).toUpperCase().substring(2)}]`

const nodeInfoOrCreated = (db: DB, opts: Options) => (maybeInfo: NodeInfo | null) =>
  maybeInfo ? Promise.resolve(maybeInfo) : db.setInfo(creationNodeInfo(opts))

const defaultOpts = (opts: Options) => ({
  name: randomName(),
  ...opts,
})
export const UIDNode = (rpc: RPC, db: DB, id: ID, opts: Options) => {
  opts = defaultOpts(opts)

  const initInfo = db.getInfo().then(nodeInfoOrCreated(db, opts))

  const sign = () => null
  const verify = () => null
  const getPayload = () => null

  return {
    sign,
    verify,
    getPayload,
    initInfo,
  }
}
