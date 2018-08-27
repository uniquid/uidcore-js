"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = require("mqtt");
const types_1 = require("../RPC/BitmaskBcoin/types");
const bufStrToObj = (messageBuf) => {
    try {
        return JSON.parse(messageBuf.toString('utf-8'));
    }
    catch (e) {
        return null;
    }
};
exports.messages = ({ announceMessage, mqttHost, rpc, rpcHandlers, requestTimeout }) => {
    rpcHandlers.forEach(({ m, h }) => rpc.register(m, h));
    const client = mqtt.connect(mqttHost);
    const publish = (msg) => new Promise((resolve, reject) => client.publish(msg.topic, JSON.stringify(msg.data), err => (err ? reject(err) : resolve())));
    const request = (userAddress, providerName, method, params) => new Promise((resolve, reject) => {
        // tslint:disable-next-line:no-magic-numbers
        const id = Math.floor(Math.random() * 1e6);
        const msg = {
            topic: providerName,
            data: {
                sender: userAddress,
                body: {
                    id,
                    method,
                    params
                }
            }
        };
        client.subscribe(userAddress);
        // tslint:disable-next-line:no-floating-promises
        publish(msg).then(() => {
            const release = () => {
                // tslint:disable-next-line:no-use-before-declare
                client.removeListener('message', handleIncomingMessages);
                client.unsubscribe(userAddress);
            };
            const handleIncomingMessages = (topic, messageBuf) => {
                const response = bufStrToObj(messageBuf);
                if (response && !types_1.isRequest(response) && topic === userAddress && id === response.body.id) {
                    release();
                    resolve(response);
                }
            };
            client.on('message', handleIncomingMessages);
            setTimeout(() => {
                release();
                reject('timeout');
            }, requestTimeout);
        }, reject);
    });
    client.on('connect', () => {
        client.subscribe(announceMessage.data.name);
        publish(announceMessage).catch(err => console.error('Publish Announce Error:', err));
    });
    client.on('message', (topic, messageBuf) => {
        const _request = bufStrToObj(messageBuf);
        _request &&
            types_1.isRequest(_request) &&
            rpc
                .manageRequest(_request)
                .then(resp => publish({ topic: _request.sender, data: resp }))
                .catch(err => console.error('Request Message Error:', err));
    });
    return { publish, request };
};
//# sourceMappingURL=message.js.map