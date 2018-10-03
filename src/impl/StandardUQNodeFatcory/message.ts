/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import * as mqtt from 'mqtt'
import { ProviderName } from '../../types/data/Contract'
import { IdAddress } from '../../types/data/Identity'
import { ID } from '../../types/layers/ID'
import { RPC } from '../RPC/BitmaskBcoin/RPC'
import { isRequest, Method, Params, Request, Response, RPCHandler } from '../RPC/BitmaskBcoin/types'
import * as Msg from './message/Defs'

export interface Config {
  announceMessage: Msg.AnnounceMessage
  mqttHost: string
  rpc: RPC
  rpcHandlers: RPCHandler[]
  requestTimeout: number
  identityFor: ID['identityFor']
}
export type MessagePublish = (msg: Msg.Message<string, any>) => Promise<void>
export type MessageRequest = (
  userAddress: string,
  providerName: string,
  method: number,
  params: string
) => Promise<Response>
export interface Messages {
  publish: MessagePublish
  request: MessageRequest
}
const bufStrToObj = (messageBuf: Buffer) => {
  try {
    return JSON.parse(messageBuf.toString('utf-8')) as Request | Response
  } catch (e) {
    return null
  }
}
export const messages = ({ announceMessage, mqttHost, rpc, rpcHandlers, requestTimeout }: Config) => {
  rpcHandlers.forEach(({ m, h }) => rpc.register(m, h))
  const client = mqtt.connect(mqttHost)

  const publish = (msg: Msg.Message<string, any>) =>
    new Promise<void>((resolve, reject) =>
      client.publish(msg.topic, JSON.stringify(msg.data), err => (err ? reject(err) : resolve()))
    )

  const request = (userAddress: IdAddress, providerName: ProviderName, method: Method, params: Params) =>
    new Promise<Response>((resolve, reject) => {
      // tslint:disable-next-line:no-magic-numbers
      const id = Math.floor(Math.random() * 1e6)
      const msg: Msg.RPCMessage = {
        topic: providerName,
        data: {
          sender: userAddress,
          body: {
            id,
            method,
            params
          }
        }
      }

      client.subscribe(userAddress)
      // tslint:disable-next-line:no-floating-promises
      publish(msg).then(() => {
        const release = () => {
          // tslint:disable-next-line:no-use-before-declare
          client.removeListener('message', handleIncomingMessages)
          client.unsubscribe(userAddress)
        }

        const handleIncomingMessages = (topic: string, messageBuf: Buffer) => {
          const response = bufStrToObj(messageBuf)
          if (response && !isRequest(response) && topic === userAddress && id === response.body.id) {
            release()
            resolve(response)
          }
        }

        client.on('message', handleIncomingMessages)

        setTimeout(() => {
          release()
          reject('timeout')
        }, requestTimeout)
      }, reject)
    })

  client.on('connect', () => {
    client.subscribe(announceMessage.data.name)
    publish(announceMessage).catch(err => console.error('Publish Announce Error:', err))
  })

  client.on('message', (topic: string, messageBuf) => {
    const _request = bufStrToObj(messageBuf)
    _request &&
      isRequest(_request) &&
      rpc
        .manageRequest(_request)
        .then(resp => publish({ topic: _request.sender, data: resp }))
        .catch(err => console.error('Request Message Error:', err))
  })

  return { publish, request }
}
