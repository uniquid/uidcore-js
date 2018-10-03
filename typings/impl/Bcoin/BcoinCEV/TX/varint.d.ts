/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
/**
 * varint utils from https://github.com/chrisdickinson/varint
 */
export declare const decodeVarInt: (buf: number[], offset?: number) => {
    res: number;
    length: number;
};
export declare const encodeVarint: (num: number, offset?: number) => {
    res: number[];
    length: number;
};
