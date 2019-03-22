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
import { IdAddress, Role } from '../../types/data/Identity'
import { ID } from '../../types/layers/ID'
import { BcoinID } from '../Bcoin/types/BcoinID'
import { BcoinAbstractIdentity } from '../Bcoin/types/data/BcoinIdentity'
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
  logger: any
}
export type MessagePublish = (msg: Msg.Message<string, any>) => Promise<void>
export type MessageRequest = (
  uqId: BcoinID,
  cIdentity: BcoinAbstractIdentity<Role>,
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
export const messages = ({ announceMessage, mqttHost, rpc, rpcHandlers, requestTimeout, logger }: Config) => {
  rpcHandlers.forEach(({ m, h }) => rpc.register(m, h))
  // this is the "main" connection:
  // handles publishing and incoming RPC requests (subscription to "nodename" topic)
  const mainClient = mqtt.connect(mqttHost)

  const publish = (msg: Msg.Message<string, any>) =>
    new Promise<void>((resolve, reject) => {
      delete msg.data.requester
      mainClient.publish(msg.topic, JSON.stringify(msg.data), err => (err ? reject(err) : resolve()))
    })

  const request = (
    uqId: BcoinID,
    cIdentity: BcoinAbstractIdentity<Role>,
    userAddress: IdAddress,
    providerName: ProviderName,
    method: Method,
    params: Params
  ) =>
    new Promise<Response>((resolve, reject) => {
      // this is the "rpc" connection:
      // one connection for each outgoing RPC request
      // this is to avoid interference between same topic subscription/unsubscription
      // that would occour for different RPCs using same contract
      const RPCRequestClient = mqtt.connect(mqttHost)
      const id = new Date().getTime()
      const msg: Msg.RPCMessage = {
        topic: providerName,
        data: {
          body: {
            id,
            method,
            params
          },
          signature: ''
        }
      }
      const stringTosign = msg.data.body.method + msg.data.body.params + msg.data.body.id
      const signature = uqId.signMessage(stringTosign, cIdentity)
      msg.data.signature = signature.toString('base64')

      let timeoutId: NodeJS.Timer
      const release = () => {
        // tslint:disable-next-line:no-use-before-declare
        RPCRequestClient.removeListener('message', handleIncomingMessages)
        RPCRequestClient.unsubscribe(userAddress)
        clearTimeout(timeoutId)
        RPCRequestClient.end()
      }

      const handleIncomingMessages = (topic: string, messageBuf: Buffer) => {
        const response = bufStrToObj(messageBuf)
        if (response && !isRequest(response) && topic === userAddress && id === response.body.id) {
          const js = response.body.error + response.body.result + response.body.id
          const valid = uqId.verifyMessage(js, response.signature)
          if (valid) {
            release()
            resolve(response)
          } else {
            release()
            resolve(response)
          }
        }
      }

      RPCRequestClient.on('connect', () => {
        RPCRequestClient.subscribe(userAddress)
        RPCRequestClient.on('message', handleIncomingMessages)

        // tslint:disable-next-line:no-floating-promises
        publish(msg).then(() => {
          timeoutId = setTimeout(() => {
            release()
            reject('timeout')
            // console.log(`Timeout for RPC id: ${msg.data.body.id}`)
          }, requestTimeout)
        }, reject)
      })
    })

  mainClient.on('connect', () => {
    mainClient.subscribe(announceMessage.data.name)
    publish(announceMessage).catch(err => logger.error('Publish Announce Error:', err))
  })

  mainClient.on('message', (topic: string, messageBuf) => {
    console.log(messageBuf.toString())
    const _request = bufStrToObj(messageBuf)
    _request &&
      isRequest(_request) &&
      rpc
        .manageRequest(_request)
        .then(resp => publish({ topic: resp.requester, data: resp }))
        .catch(err => logger.error('Request Message Error:', err))
  })

  return { publish, request }
}
