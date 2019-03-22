/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Request, SigRequest } from '../../RPC/BitmaskBcoin/types';
export interface Message<Topic extends string, M> {
    topic: Topic;
    data: M;
}
export interface AnnounceData {
    name: string;
    xpub: string;
}
export declare type AnnounceMessage = Message<string, AnnounceData>;
export declare type RPCMessage = Message<string, Request | SigRequest>;
