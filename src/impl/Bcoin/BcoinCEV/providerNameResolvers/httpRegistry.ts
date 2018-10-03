/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { IdAddress } from 'types/data/Identity'
import { ProviderNameResolver } from '../CtrManager'
// tslint:disable-next-line:no-require-imports
const get = require('simple-get')

/**
 * An implementation of {@link ProviderNameResolver} which queries a UQ Registry HTTP service
 * for a provider name agains its ${IdAddress}
 *
 * @param {string} baseUrl the base Url of the Regisry service
 * @returns {ProviderNameResolver}
 */
export const fromHTTPRegistry = (baseUrl: string): ProviderNameResolver => (providerAddress: IdAddress) =>
  new Promise((resolve, reject) => {
    get.concat(
      {
        method: 'GET',
        url: `${baseUrl}/registry?providerAddress=${providerAddress}`,
        json: true
      },
      (err: any, resp: any, data: any) => {
        if (err) {
          return reject(String(err))
        } else if (!(data && data[0] && data[0].provider_name)) {
          return reject('Unknown Error')
        } else {
          resolve(data && data[0] && (data[0].provider_name as string))
        }
      }
    )
  })
