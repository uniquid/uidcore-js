import { ProviderIdentity, UserIdentity } from './Identity'

export const CREATED = 'CREATED_NODE'
export const IMPRINTED = 'IMPRINTED_NODE'
export const READY = 'READY_NODE'
export type NodeState = typeof IMPRINTED | typeof READY | typeof CREATED

export interface BaseNodeInfo {
  name: string
  state: NodeState
  lastUserId: null | UserIdentity
  lastProviderId: null | ProviderIdentity
}
export interface CreatedNodeData extends BaseNodeInfo {
  createdAt: number
}

export interface ImprintedNodeData extends CreatedNodeData {
  imprintedAt: number
}

// export interface ReadyNodeData extends ImprintedNodeData {
//   readyAt: number
// }

export interface CreatedNode extends CreatedNodeData {
  state: typeof CREATED
}

export interface ImprintedNode extends ImprintedNodeData {
  state: typeof IMPRINTED
}

// export interface ReadyNode extends ReadyNodeData {
//   state: typeof READY
// }

export type NodeInfo = CreatedNode | ImprintedNode // | ReadyNode
