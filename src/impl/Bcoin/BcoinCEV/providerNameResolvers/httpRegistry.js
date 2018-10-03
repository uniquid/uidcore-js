"use strict";
exports.__esModule = true;
// tslint:disable-next-line:no-require-imports
var get = require('simple-get');
/**
 * An implementation of {@link ProviderNameResolver} which queries a UQ Registry HTTP service
 * for a provider name agains its ${IdAddress}
 *
 * @param {string} baseUrl the base Url of the Regisry service
 * @returns {ProviderNameResolver}
 */
exports.fromHTTPRegistry = function (baseUrl) { return function (providerAddress) {
    return new Promise(function (resolve, reject) {
        get.concat({
            method: 'GET',
            url: baseUrl + "/registry?providerAddress=" + providerAddress,
            json: true
        }, function (err, resp, data) {
            if (err) {
                return reject(String(err));
            }
            else if (!(data && data[0] && data[0].provider_name)) {
                return reject('Unknown Error');
            }
            else {
                resolve(data && data[0] && data[0].provider_name);
            }
        });
    });
}; };
