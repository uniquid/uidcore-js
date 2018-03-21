import { CreatedNodeInfo, NodeInfo, NodeState } from './types/data/NodeInfo'
import { CEV } from './types/layers/CEV'
import { DB } from './types/layers/DB'
import { ID } from './types/layers/ID'

export interface Options {
  name: string
}

const justCreatedNodeInfo = (opts: Options): CreatedNodeInfo => ({
  name: opts.name,
  createdAt: Number(new Date()),
  imprintedAt: null,
  state: NodeState.Created,
  nextUserId: null,
  nextProviderId: null,
})

// tslint:disable-next-line:no-magic-numbers
const randomName = () => `JSNode[${Math.random().toString(36).toUpperCase().substring(2)}]`

const nodeInfoOrCreated = (db: DB, opts: Options) => (maybeInfo: NodeInfo | null) => {
  const nodeInfo = maybeInfo || justCreatedNodeInfo(opts)

  return maybeInfo ? Promise.resolve(maybeInfo) : db.setInfo(nodeInfo).then(() => nodeInfo)
}

const defaultOpts = (opts: Options) => ({
  name: randomName(),
  ...opts,
})
export const CH = (cev: CEV, db: DB, id: ID, opts: Options) => {
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
