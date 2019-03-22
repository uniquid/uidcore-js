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
import {
  isRequest,
  Method,
  Params,
  Request,
  Response,
  RPCHandler,
  SigRequest,
  SigResponse
} from '../RPC/BitmaskBcoin/types'
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
  params: string,
  sig: boolean
) => Promise<Response | SigResponse>
export interface Messages {
  publish: MessagePublish
  request: MessageRequest
}
const bufStrToObj = (messageBuf: Buffer) => {
  try {
    return JSON.parse(messageBuf.toString('utf-8')) as Request | SigRequest | Response | SigResponse
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
      if (msg.data.hasOwnProperty('requester')) delete msg.data.requester
      mainClient.publish(msg.topic, JSON.stringify(msg.data), err => (err ? reject(err) : resolve()))
    })

  const request = (
    uqId: BcoinID,
    cIdentity: BcoinAbstractIdentity<Role>,
    userAddress: IdAddress,
    providerName: ProviderName,
    method: Method,
    params: Params,
    sig: boolean
  ) =>
    new Promise<Response | SigResponse>((resolve, reject) => {
      // this is the "rpc" connection:
      // one connection for each outgoing RPC request
      // this is to avoid interference between same topic subscription/unsubscription
      // that would occour for different RPCs using same contract
      const RPCRequestClient = mqtt.connect(mqttHost)
      const id = new Date().getTime()
      let msg: Msg.RPCMessage
      if (sig) {
        msg = {
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
        msg.data = msg.data as SigRequest

        const stringTosign = msg.data.body.method + msg.data.body.params + msg.data.body.id
        const signature = uqId.signMessage(stringTosign, cIdentity)
        msg.data.signature = signature.toString('base64')
      } else {
        msg = {
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
        msg.data = msg.data as Request
      }

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
          if (!response.hasOwnProperty('sender') && response.hasOwnProperty('signature')) {
            const js = response.body.error + response.body.result + response.body.id
            const valid = uqId.verifyMessage(js, (response as SigResponse).signature)
            if (valid) {
              release()
              resolve(response)
            } else {
              release()
              resolve(response)
            }
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
        .then(function(resp) {
          if (resp.hasOwnProperty('requester') && resp.hasOwnProperty('signature')) {
            // tslint:disable-next-line:no-floating-promises
            publish({ topic: (resp as SigResponse).requester, data: resp as SigResponse })
          } else {
            // tslint:disable-next-line:no-floating-promises
            publish({ topic: (_request as Request).sender, data: resp as Response })
          }
        })
        .catch(err => logger.error('Request Message Error:', err))
  })

  return { publish, request }
}
