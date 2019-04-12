/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
export declare type IdAddress = string;
export declare type IdIndex = number;
/**
 * Role in a contract may be User or Provider
 *
 * @enum {number}
 * @export
 */
export declare enum Role {
    Provider = "PROVIDER",
    User = "USER",
}
/**
 * An abstract representaton of an internal identity
 *
 * @interface AbstractIdentity
 * @template R role of Identity
 * @export
 */
export interface AbstractIdentity<R extends Role> {
    /**
     * the identity role
     *
     * @type {R}
     * @memberof AbstractIdentity
     */
    role: R;
    /**
     * the identity index
     *
     * @type {number}
     * @memberof AbstractIdentity
     */
    index: number;
}
/**
 * A full identity complete with address
 *
 * @interface Identity
 * @extends {AbstractIdentity<R>}
 * @template R
 */
export interface Identity<R extends Role> extends AbstractIdentity<R> {
    address: IdAddress;
}
