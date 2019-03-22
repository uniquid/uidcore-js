/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { ProviderContract } from '../../../types/data/Contract'
import { IdAddress } from '../../../types/data/Identity'

export const BLANK_RESULT = ''
export const ERROR_METHOD_NOT_IMPLEMENTED = 5
export const ERROR_NOT_AUTHORIZED = 4
export const ERROR_NONE = 0

/**
 * Bitmask's RPC Request Body
 *
 * @interface RequestBody
 * @export
 */
export interface RequestBody {
  /**
   * the bit number associated to the invoked method
   *
   * @type {Method}
   * @memberof RequestBody
   */
  method: Method
  /**
   * params is a serialized string
   *
   * @type {Params}
   * @memberof RequestBody
   */
  params: Params
  id: Nonce
}
/**
 * Bitmask's RPC Request
 *
 * @interface Request
 * @export
 */
export interface Request {
  /**
   * the sender's {@link IdAddress}
   *
   * @type {IdAddress}
   * @memberof Request
   */
  // sender: IdAddress
  body: RequestBody
  signature: string
}

/**
 * Bitmask's RPC Response Body
 *
 * @interface ResponseBody
 * @export
 */
export interface ResponseBody {
  id: Nonce
  /**
   * params is a serialized string
   *
   * @type {Params}
   * @memberof RequestBody
   */
  result: Result
  /**
   * params is a serialized string
   *
   * @type {Params}
   * @memberof RequestBody
   */
  error: Error
}
/**
 * Bitmask's RPC Response
 *
 * @interface ResponseBody
 * @export
 */
export interface Response {
  requester: IdAddress
  body: ResponseBody
  signature: string
}
export type Nonce = number
export type Handler = (params: Params, contract: ProviderContract) => Promise<Result> | Result
export type Method = number
export type Params = string
export type Result = string
export type Error = typeof ERROR_METHOD_NOT_IMPLEMENTED | typeof ERROR_NOT_AUTHORIZED | typeof ERROR_NONE

export const isRequest = (msg: Request | Response): msg is Request => 'method' in msg.body

export interface RPCHandler {
  m: Method
  h: Handler
}
