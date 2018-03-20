import { AbstractIdentity, Role } from './Identity'

export enum NodeState {
  Created = 'CREATED',
  Imprinted = 'IMPRINTED',
}

export interface AbstractNodeInfo {
  name: string
  state: NodeState
  createdAt: number | null
  imprintedAt: number | null
  nextUserId: AbstractIdentity<Role.User> | null
  nextProviderId: AbstractIdentity<Role.Provider> | null
}

export interface CreatedNodeInfo extends AbstractNodeInfo {
  state: NodeState.Created
  createdAt: number
  imprintedAt: null
  nextUserId: null
  nextProviderId: null
}

export interface ImprintedNodeInfo extends AbstractNodeInfo {
  state: NodeState.Created
  createdAt: number
  imprintedAt: number
  nextUserId: AbstractIdentity<Role.User>
  nextProviderId: AbstractIdentity<Role.Provider>
}

export type NodeInfo = CreatedNodeInfo | ImprintedNodeInfo
