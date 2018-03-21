// import { Contract } from './types/data/Contract'
// import { Role } from './types/data/Identity'
// import { CreatedNodeInfo, NodeState } from './types/data/NodeInfo'
import { CEV } from './types/layers/CEV'
import { DB } from './types/layers/DB'
import { ID } from './types/layers/ID'

export interface Options {
  name: string
}

// const justCreatedNodeInfo = (opts: Options): CreatedNodeInfo => ({
//   name: opts.name,
//   createdAt: Number(new Date()),
//   state: NodeState.Created,
// })

// tslint:disable-next-line:no-magic-numbers
// const randomName = () => `JSNode[${Math.random().toString(36).toUpperCase().substring(2)}]`

// const defaultOpts = (opts: Options) => ({
//   name: randomName(),
//   ...opts,
// })
export const CH = (cev: CEV, db: DB, id: ID, opts: Options) => {
  // const onContract = (ctr: Contract<Role>) => null
  // const initializationLoop = () =>
  //   db.getInfo().then(info => {
  //     if (!info) {
  //       db.setInfo(justCreatedNodeInfo(opts)).then(initializationLoop)
  //     } else if (info.state === NodeState.Created) {
  //       cev.onImprinting().then(db.storeImprinting).then(initializationLoop)
  //     } else if (info.state === NodeState.Imprinted) {
  //       cev.onOrchestration().then(db.storeOrchestration).then(initializationLoop)
  //     } else if (info.state === NodeState.Orchestrated) {
  //       cev.onContract(onContract)
  //     }
  //   })
  // opts = defaultOpts(opts)
  // const sign = () => null
  // const verify = () => null
  // const getPayload = () => null
  // return {
  //   sign,
  //   verify,
  //   getPayload,
  // }
}
