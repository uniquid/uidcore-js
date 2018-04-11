import { Role } from '../../../../types/data/Identity'

import { identityFor, signFor } from '../HD'

// import { randomBytes } from 'crypto'

const masterPrivKey =
  'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK'

describe('HD keys derivation', () => {
  // it('derive Private Key', () => {
  //   const derivedPrivkey = derivePrivateKey(masterPrivKey)([0, 1, 1])
  //   expect(derivedPrivkey.toBase58()).toBe(
  //     'tprv8mTK23nwj29zt2fizqTMR2zCQhE94xoVdRZbuJ6XNKpb9P79jnNjsejP8CLJoSsJPcxZmA3SVxhHgW5ndpNUyessuCmKwKW3xvqQcx2xohx'
  //   )
  // })
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
    // https://github.com/uniquid/uidcore-c/blob/master/tests.c#L50
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
      ext: '0' as '0',
    }

    // tslint:disable-next-line:no-magic-numbers
    const result = signFor(masterPrivKeyForSign)(abstrId, hash, false)
    expect(result.toString('hex')).toBe(expected.toString('hex'))
  })
})
