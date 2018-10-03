/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { ContractExchangeValidator } from '../../../types/layers/ContractExchangeValidator'
import { HDPath } from '../BcoinID/HD'

/**
 * Current BCoin implementation for ContractExchangeValidator extends it with a signRawTransaction method
 *
 *
 * @interface BcoinCEV
 * @extends {ContractExchangeValidator}
 */
export interface BcoinCEV extends ContractExchangeValidator {
  /**
   * Signs inputs of a raw string BC transaction against an array of identity path
   * Transaction is signed as by Uniquid specifications
   *
   * @param {string} txString the raw transaction to sign
   * @param {HDPath[]} paths the array of HDPath at wich sign transaction inputs, paths length must be equal to transaction's inputs amount
   * @returns {Promise<string>}
   * @memberof BcoinCEV
   */
  signRawTransaction(txString: string, paths: HDPath[]): Promise<string>
}
