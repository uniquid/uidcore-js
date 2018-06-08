import { Request } from '../../RPC/BitmaskBcoin/types'

export interface Message<Topic extends string, M> {
  topic: Topic
  data: M
}

export interface AnnounceData {
  name: string
  xpub: string
}
export type AnnounceMessage = Message<string, AnnounceData>

export type RPCMessage = Message<string, Request>
