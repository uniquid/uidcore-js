import { Role } from '../../../../types/data/Identity'

import { derivePrivateKey, identityFor } from '../HD'

const masterPrivKey =
  'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK'
describe('HD keys derivation', () => {
  it('derive Private Key', () => {
    const derivedPrivkey = derivePrivateKey(masterPrivKey)([1, 1])
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
})
