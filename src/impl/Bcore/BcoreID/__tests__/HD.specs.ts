import { Role } from '../../../../types/data/Identity'

import { derivePrivateKey, identityFor, signFor } from '../HD'

// import { randomBytes } from 'crypto'

const masterPrivKey =
  'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK'

describe('HD keys derivation', () => {
  it('derive Private Key', () => {
    const derivedPrivkey = derivePrivateKey(masterPrivKey)([0, 1, 1])
    expect(derivedPrivkey.toBase58()).toBe(
      'tprv8knzXLyzXNU2S5ccu2F2y8LYqK4YDjrD4uoaC6froKRTig9nn5jjSTVPAsqsQcmkyayA5ooih3eRJv7jqfxMCK8gbNGhCPxC5rctSTcgUhi'
    )
  })
  it('derive ProviderIdentity', () => {
    // m/44'/0'/0/0/1/5
    const identity = identityFor(masterPrivKey)({ role: Role.Provider, index: 5 })
    expect(identity.address).toBe('n26AHAeWe9NxTFmZ7DuDtCaBNMzfcKzPRA')
  })
  it('derive UserIdentity', () => {
    // m/44'/0'/0/1/0/5
    const identity = identityFor(masterPrivKey)({ role: Role.User, index: 5 })
    expect(identity.address).toBe('mqQt5iKft7ZNuTfdCVMxwuzc2RK9DwcyFz')
  })
  it('signs hash for an AbstractIdentity', () => {
    const masterPrivKeyForSign =
      'tprv8ZgxMBicQKsPdoj3tQG8Z2bzNsCTsk9heayJQA1pQStVx2hLEyVwx6gfHZ2p4dSzbvaEw7qrDXnX54vTVbkLghZcB24TXuj1ADXPUCvyfcy'
    // prettier-ignore
    // tslint:disable-next-line:no-magic-numbers
    const hash = Buffer.from([0x0e,0x78,0xb2,0x90,0x4c,0xff,0x87,0x87,0x30,0x04,0x2f,0x27,0xf7,0x95,0xdc,0x85,0xa6,0xa3,0x31,0x2b,0x6d,0x84,0xf7,0xa4,0x9d,0x44,0xa3,0xd9,0x7e,0xba,0xa0,0xe0])
    // prettier-ignore
    // tslint:disable-next-line:no-magic-numbers
    const expected = Buffer.from([0xbc,0x52,0xa0,0xa2,0x87,0xdd,0xa0,0x3d,0x21,0x92,0xe1,0xa5,0x5e,0xe3,0x80,0x48,0x14,0xb2,0x88,0x58,0xb2,0x7e,0x53,0x7b,0x71,0xae,0xc6,0x28,0x5e,0xec,0xb9,0x55,0x68,0x31,0x91,0x53,0xe5,0x72,0x6f,0x63,0x8c,0xf1,0x9e,0xcc,0xff,0xa3,0x8a,0xf3,0x0a,0x3a,0x46,0x4f,0x14,0xf9,0x35,0xba,0xf0,0xc1,0xc9,0x45,0x98,0xd7,0xdf,0xe0])
    const abstrId = {
      role: Role.Provider,
      index: 17,
      ext: '0',
    }

    // tslint:disable-next-line:no-magic-numbers
    const result = signFor(masterPrivKeyForSign)(abstrId, hash)
    expect(result.toString('hex')).toBe(expected.toString('hex'))
  })
})

/**
 * for CEV ;)
 * it('signs transaction', () => {
 *
 *   //  orchestration tank-c-1
 *   // {"sender":"mhtGWdgq2gnrNvaxFA2rXNAPypsv9ECfuc","body":{"method":30,"id":746339918,"params":"{\"tx\":\"010000000136c5a79de0dac41a7c1e9c4d5c833c7633ab540451443909a7d9f9bc758e60d8000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88acf07e0e00000000001976a9140fc863841cf1ec7fcadf8364c33c32187c87d9da88ac00000000\",\"paths\":[\"0/0/0\"]}"}}
 *   // {"sender":"mq2jvM52UirEKs14T9g9qoVH9C4rWnAzBX","body":{"result":"0 - 2164fa1d4257a353140c8b219bf0aa711943eef3d013a7b5be38e40bea34ff94","error":0,"id":746339918}}
 *
 *   const masterPrivKeyForSign =
 *     'tprv8ZgxMBicQKsPfK9E21aFhEzxnyKFZqyMPHRGTv3eDdwvQsYgDATubZVURBdnwp2WhtwyxC2u6XnhQDaPEzZs99yn9vBpaHgZYyQ3whp1sfR'
 *   const rawtx =
 *     '010000000136c5a79de0dac41a7c1e9c4d5c833c7633ab540451443909a7d9f9bc758e60d8000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88acf07e0e00000000001976a9140fc863841cf1ec7fcadf8364c33c32187c87d9da88ac00000000'
 *   const expected = '2164fa1d4257a353140c8b219bf0aa711943eef3d013a7b5be38e40bea34ff94' // ( `0 - ${expected}` )
 *
 */
