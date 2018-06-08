import { ProviderContract } from '../../../types/data/Contract';
import { IdAddress } from '../../../types/data/Identity';
export declare const BLANK_RESULT = "";
export declare const ERROR_METHOD_NOT_IMPLEMENTED = 5;
export declare const ERROR_NOT_AUTHORIZED = 4;
export declare const ERROR_NONE = 0;
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
    method: Method;
    /**
     * params is a serialized string
     *
     * @type {Params}
     * @memberof RequestBody
     */
    params: Params;
    id: Nonce;
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
    sender: IdAddress;
    body: RequestBody;
}
/**
 * Bitmask's RPC Response Body
 *
 * @interface ResponseBody
 * @export
 */
export interface ResponseBody {
    id: Nonce;
    /**
     * params is a serialized string
     *
     * @type {Params}
     * @memberof RequestBody
     */
    result: Result;
    /**
     * params is a serialized string
     *
     * @type {Params}
     * @memberof RequestBody
     */
    error: Error;
}
/**
 * Bitmask's RPC Response
 *
 * @interface ResponseBody
 * @export
 */
export interface Response {
    sender: IdAddress;
    body: ResponseBody;
}
export declare type Nonce = number;
export declare type Handler = (params: Params, contract: ProviderContract) => Promise<Result> | Result;
export declare type Method = number;
export declare type Params = string;
export declare type Result = string;
export declare type Error = typeof ERROR_METHOD_NOT_IMPLEMENTED | typeof ERROR_NOT_AUTHORIZED | typeof ERROR_NONE;
export declare const isRequest: (msg: Request | Response) => msg is Request;
export interface RPCHandler {
    m: Method;
    h: Handler;
}
