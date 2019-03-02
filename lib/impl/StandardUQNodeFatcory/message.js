"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
var mqtt = require("mqtt");
var types_1 = require("../RPC/BitmaskBcoin/types");
var base64 = require("base-64");
var utf8 = require("utf8");
var bufStrToObj = function (messageBuf) {
    try {
        return JSON.parse(messageBuf.toString('utf-8'));
    }
    catch (e) {
        return null;
    }
};
exports.messages = function (_a) {
    var announceMessage = _a.announceMessage, mqttHost = _a.mqttHost, rpc = _a.rpc, rpcHandlers = _a.rpcHandlers, requestTimeout = _a.requestTimeout, logger = _a.logger;
    rpcHandlers.forEach(function (_a) {
        var m = _a.m, h = _a.h;
        return rpc.register(m, h);
    });
    // this is the "main" connection:
    // handles publishing and incoming RPC requests (subscription to "nodename" topic)
    var mainClient = mqtt.connect(mqttHost);
    var publish = function (msg) {
        return new Promise(function (resolve, reject) {
            mainClient.publish(msg.topic, JSON.stringify(msg.data), function (err) { return (err ? reject(err) : resolve()); });
        });
    };
    var request = function (userAddress, providerName, method, params) {
        return new Promise(function (resolve, reject) {
            // this is the "rpc" connection:
            // one connection for each outgoing RPC request
            // this is to avoid interference between same topic subscription/unsubscription
            // that would occour for different RPCs using same contract
            var RPCRequestClient = mqtt.connect(mqttHost);
            var bytes = utf8.encode(params);
            var encoded = base64.encode(bytes);
            params = encoded;
            // tslint:disable-next-line:no-magic-numbers
            var id = Math.floor(Math.random() * 1e6);
            var msg = {
                topic: providerName,
                data: {
                    sender: userAddress,
                    body: {
                        id: id,
                        method: method,
                        params: params
                    }
                }
            };
            var timeoutId;
            var release = function () {
                // tslint:disable-next-line:no-use-before-declare
                RPCRequestClient.removeListener('message', handleIncomingMessages);
                RPCRequestClient.unsubscribe(userAddress);
                clearTimeout(timeoutId);
                RPCRequestClient.end();
            };
            var handleIncomingMessages = function (topic, messageBuf) {
                var response = bufStrToObj(messageBuf);
                if (response && !types_1.isRequest(response) && topic === userAddress && id === response.body.id) {
                    release();
                    resolve(response);
                }
            };
            RPCRequestClient.on('connect', function () {
                RPCRequestClient.subscribe(userAddress);
                RPCRequestClient.on('message', handleIncomingMessages);
                // tslint:disable-next-line:no-floating-promises
                publish(msg).then(function () {
                    timeoutId = setTimeout(function () {
                        release();
                        reject('timeout');
                        // console.log(`Timeout for RPC id: ${msg.data.body.id}`)
                    }, requestTimeout);
                }, reject);
            });
        });
    };
    mainClient.on('connect', function () {
        mainClient.subscribe(announceMessage.data.name);
        publish(announceMessage).catch(function (err) { return logger.error('Publish Announce Error:', err); });
    });
    mainClient.on('message', function (topic, messageBuf) {
        var _request = bufStrToObj(messageBuf);
        _request &&
            types_1.isRequest(_request) &&
            rpc
                .manageRequest(_request)
                .then(function (resp) { return publish({ topic: _request.sender, data: resp }); })
                .catch(function (err) { return logger.error('Request Message Error:', err); });
    });
    return { publish: publish, request: request };
};
//# sourceMappingURL=message.js.map