import { AbstractIdentity, Role } from './Identity'

export enum NodeState {
  Created = 'CREATED',
  Imprinted = 'IMPRINTED',
  Orchestrated = 'ORCHESTRATED',
}

export interface AbstractNodeInfoData {
  name: string
  createdAt: number | null
}

export interface CreatedNodeInfoData extends AbstractNodeInfoData {
  createdAt: number
}

export interface ImprintedNodeInfoData extends CreatedNodeInfoData {
  createdAt: number
  imprintedAt: number
}

export interface OrchestratedNodeInfoData extends ImprintedNodeInfoData {
  orchestratedAt: number
  nextUserId: AbstractIdentity<Role.User>
  nextProviderId: AbstractIdentity<Role.Provider>
}
export interface CreatedNodeInfo extends CreatedNodeInfoData {
  state: NodeState.Created
}
export interface ImprintedNodeInfo extends ImprintedNodeInfoData {
  state: NodeState.Imprinted
}
export interface OrchestratedNodeInfo extends OrchestratedNodeInfoData {
  state: NodeState.Orchestrated
}

export type NodeInfo = CreatedNodeInfo | ImprintedNodeInfo | OrchestratedNodeInfo
