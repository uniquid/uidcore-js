/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
export const rawHexStringToIntArray = (raw: string) => {
  const rawHexStrArray: string[] = []
  let idx = 0
  while (idx < raw.length) {
    // tslint:disable-next-line:no-magic-numbers
    rawHexStrArray.push(Array.prototype.slice.call(raw, idx, (idx += 2)).join(''))
  }

  // tslint:disable-next-line:no-magic-numbers
  return rawHexStrArray.map(hex => parseInt(hex, 16))
}
const padHex = (hex: string) => (hex.length === 1 ? `0${hex}` : hex)
export const intArrayToRawHexString = (tx: number[]) =>
  tx
    // tslint:disable-next-line:no-magic-numbers
    .map(n => padHex(n.toString(16)))
    .join('')
