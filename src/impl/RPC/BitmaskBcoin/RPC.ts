import { Buffer } from 'buffer'
import { CH } from './../../../CH'
import { AbstractIdentity, Role } from './../../../types/data/Identity'
import { Handler, Method, Params, Request, Response } from './types'

export const ERROR_NOT_IMPLEMENTED = 'Method not implemented'
export const ERROR_NOT_ALLOWED = 'Not allowed'
const bitmask = (payload: Buffer) =>
  ((payload as any).data as number[])
    // tslint:disable-next-line:no-magic-numbers
    .slice(1, 19)
    .reverse()
    // tslint:disable-next-line:no-magic-numbers
    .map(n => Array.from(n.toString(2).padStart(8, '0')))
    .reduce((a, b) => a.concat(b))
    .reverse()
    .map(str => Boolean(Number(str)))

const verify = (payload: Buffer, method: Method) => bitmask(payload)[method]

const manageRequest = (ch: CH, handlers: Handlers) => async <Nonce extends string>(
  request: Request<Nonce>
): Promise<Response<Nonce>> => {
  let result = ''
  let error = ''
  let sender = ''
  const { method, params } = request.body
  const contract = ch.getContractForExternalUser(request.sender)
  if (contract && verify(contract.payload, method)) {
    const providerIdentity = ch.identityFor(contract.identity)
    sender = providerIdentity.address
    const handler = handlers[method]
    if (handler) {
      try {
        result = await handler(providerIdentity, params)
      } catch (err) {
        error = String(err)
      }
    } else {
      error = ERROR_NOT_IMPLEMENTED
    }
  } else {
    error = ERROR_NOT_ALLOWED
  }

  return {
    sender,
    body: {
      result,
      error,
      id: request.body.id,
    },
  }
}

const ECHO_FN = 31
const echo: Handler = (absIdentity: AbstractIdentity<Role.Provider>, what: Params) => what

const SIGN_FN = 30
const sign = (ch: CH): Handler => (absIdentity: AbstractIdentity<Role.Provider>, params: Params) => {
  const paramsBuffer = Buffer.from(params, 'utf8')
  const resultBuffer = ch.sign(absIdentity, paramsBuffer)

  return resultBuffer.toString('utf-8')
}

interface Handlers {
  [method: number]: Handler
}
export const makeRPC = (commHelper: CH) => {
  const handlers: Handlers = {}
  const register = (method: Method, handler: Handler) => (handlers[method] = handler)
  register(SIGN_FN, sign(commHelper))
  register(ECHO_FN, echo)
  const registerUserFunctionHandler = (method: Method, handler: Handler) =>
    // tslint:disable-next-line:no-magic-numbers
    method > 31 ? (handlers[method] = handler) : null

  return {
    manageRequest: manageRequest(commHelper, handlers),
    register: registerUserFunctionHandler,
  }
}
