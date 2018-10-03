/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// http://wiki.uniquid.com/books/uniquid-achitecture-v01-using-uidcore-c/page/architettura-generale
export const VERSION_BYTE_LENGTH = 1
export const SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH = 4
export const USER_DEFINED_RPC_FUNCS_BYTE_LENGTH = 14
export const GUARANTORS_AMT_BYTE_LENGTH = 1
export const GUARANTOR_ADDRESS_BYTE_LENGTH = 20
export const GUARANTOR_ADDRESSES_AMT = 3
export const PAYLOAD_LENGTH =
  VERSION_BYTE_LENGTH +
  SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH +
  USER_DEFINED_RPC_FUNCS_BYTE_LENGTH +
  GUARANTORS_AMT_BYTE_LENGTH +
  GUARANTOR_ADDRESS_BYTE_LENGTH * GUARANTOR_ADDRESSES_AMT // 80
export const FULL_ACCESS_BYTE = 255

// export const ImprintingPayload: Payload = Array.from(
//   Buffer.concat(
//     [
//       Buffer.alloc(VERSION_BYTE_LENGTH),
//       Buffer.alloc(SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH + USER_DEFINED_RPC_FUNCS_BYTE_LENGTH, FULL_ACCESS_BYTE),
//       Buffer.alloc(GUARANTORS_AMT_BYTE_LENGTH + GUARANTOR_ADDRESS_BYTE_LENGTH * GUARANTOR_ADDRESSES_AMT)
//     ],
//     PAYLOAD_LENGTH
//   )
// )
