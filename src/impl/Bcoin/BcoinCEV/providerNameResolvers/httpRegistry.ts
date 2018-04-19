import { ProviderNameResolver } from '../CtrManager'
// tslint:disable-next-line:no-require-imports
const get = require('simple-get')

export const fromHTTPRegistry = (baseUrl: string): ProviderNameResolver => providerAddress =>
  new Promise((resolve, reject) => {
    get.concat(
      {
        method: 'GET',
        url: `${baseUrl}/registry?providerAddress=${providerAddress}`,
        json: true,
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
