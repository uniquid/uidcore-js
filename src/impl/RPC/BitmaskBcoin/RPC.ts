import { Payload } from '../../../types/data/Contract'
import { HDPath } from '../../Bcoin/BcoinID/HD'
import { BcoinCEV } from '../../Bcoin/types/BcoinCEV'
import { BcoinDB } from '../../Bcoin/types/BcoinDB'
import { BcoinID } from '../../Bcoin/types/BcoinID'
import { ImprintingContract } from './../../../types/data/Contract'
import {
  SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH,
  USER_DEFINED_RPC_FUNCS_BYTE_LENGTH,
  VERSION_BYTE_LENGTH
} from './PayloadDef'
import {
  BLANK_RESULT,
  Error,
  ERROR_METHOD_NOT_IMPLEMENTED,
  ERROR_NONE,
  ERROR_NOT_AUTHORIZED,
  Handler,
  Method,
  Params,
  Request,
  Response,
  Result
} from './types'

const bitmask = (payload: Payload) =>
  payload
    .slice(
      VERSION_BYTE_LENGTH,
      VERSION_BYTE_LENGTH + SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH + USER_DEFINED_RPC_FUNCS_BYTE_LENGTH
    )
    .reverse()
    // convert to binary string an pad left 0s up to 8 (bytelength)
    // tslint:disable-next-line:no-magic-numbers
    .map(n => Array.from(n.toString(2).padStart(8, '0')))
    .reduce((a, b) => a.concat(b))
    .reverse()
    .map(str => Boolean(Number(str)))

const verify = (payload: Payload, method: Method) => bitmask(payload)[method]

const manageRequest = (db: BcoinDB, id: BcoinID, handlers: Handlers) => (request: Request): Promise<Response> =>
  new Promise(async (resolve, reject) => {
    const { method, params } = request.body
    const contract = db.getContractForExternalUser(request.sender)
    if (contract) {
      let error: Error = ERROR_NONE
      let result: Result = BLANK_RESULT
      const providerIdentity = id.identityFor(contract.identity)
      const sender = providerIdentity.address
      if ((contract as ImprintingContract).imprinting || verify(contract.payload, method)) {
        const handler = handlers[method]
        if (handler) {
          try {
            result = await handler(params, contract)
          } catch (err) {
            result = String(err)
          }
        } else {
          error = ERROR_METHOD_NOT_IMPLEMENTED
        }
      } else {
        error = ERROR_NOT_AUTHORIZED
      }
      const response: Response = {
        sender,
        body: {
          result,
          error,
          id: request.body.id
        }
      }
      resolve(response)
    }
    reject(`No contract for user:${request.sender}`)
  })

const ECHO_FN = 31
const echo: Handler = (what: Params) => what

const SIGN_FN = 30
const sign = (cev: BcoinCEV): Handler => async (params: Params) => {
  const { tx, paths }: { tx: string; paths: string[] } = JSON.parse(params)
  const hdPaths: HDPath[] = paths.map(str => str.split('/'))

  return await cev.signRawTransaction(tx, hdPaths).then(txid => `0 - ${txid}`)
}

interface Handlers {
  [method: number]: Handler
}
const MIN_USER_FUNC_BIT = 32
const MAX_USER_FUNC_BIT = 143
export interface RPC {
  manageRequest(request: Request): Promise<Response>
  register(method: number, handler: Handler): Handler | null
}
export const makeRPC = (cev: BcoinCEV, db: BcoinDB, id: BcoinID): RPC => {
  const handlers: Handlers = {}
  const register = (method: Method, handler: Handler) => (handlers[method] = handler)
  register(SIGN_FN, sign(cev))
  register(ECHO_FN, echo)
  const registerUserFunctionHandler = (method: Method, handler: Handler) =>
    method >= MIN_USER_FUNC_BIT && method <= MAX_USER_FUNC_BIT ? (handlers[method] = handler) : null

  return {
    manageRequest: manageRequest(db, id, handlers),
    register: registerUserFunctionHandler
  }
}
