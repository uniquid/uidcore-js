/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { AbstractIdentity, Identity, Role } from '../../../../types/data/Identity';
export declare type ExtPath = '0' | '1';
/**
 * BitCoin extension for AbstractIdentity
 *
 * @interface BcoinAbstractIdentity
 * @extends {AbstractIdentity<R>}
 * @template R
 */
export interface BcoinAbstractIdentity<R extends Role> extends AbstractIdentity<R> {
    /**
     * ext determines if identity points to external (1) or internal (0) wallet branch
     * http://wiki.uniquid.com/books/uniquid-achitecture-v01-using-uidcore-c/page/architettura-generale#bkmrk-bip-32
     *
     * @type {ExtPath}
     * @memberof BcoinAbstractIdentity
     */
    ext: ExtPath;
}
/**
 * BcoinIdentity extends BcoinAbstractIdentity and Identity
 *
 * @interface BcoinIdentity
 * @extends {BcoinAbstractIdentity<R>}
 * @extends {Identity<R>}
 * @template R
 */
export interface BcoinIdentity<R extends Role> extends BcoinAbstractIdentity<R>, Identity<R> {
}
