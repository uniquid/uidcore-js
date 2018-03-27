import { Role } from '../../../../types/data/Identity'

import { derivePrivateKey, identityFor, signFor } from '../HD'

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
  it('signs transaction', () => {
    //  orchestration tank-c-1
    // {"sender":"mhtGWdgq2gnrNvaxFA2rXNAPypsv9ECfuc","body":{"method":30,"id":746339918,"params":"{\"tx\":\"010000000136c5a79de0dac41a7c1e9c4d5c833c7633ab540451443909a7d9f9bc758e60d8000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88acf07e0e00000000001976a9140fc863841cf1ec7fcadf8364c33c32187c87d9da88ac00000000\",\"paths\":[\"0/0/0\"]}"}}
    // {"sender":"mq2jvM52UirEKs14T9g9qoVH9C4rWnAzBX","body":{"result":"0 - 2164fa1d4257a353140c8b219bf0aa711943eef3d013a7b5be38e40bea34ff94","error":0,"id":746339918}}

    const masterPrivKeyForSign =
      'tprv8ZgxMBicQKsPfK9E21aFhEzxnyKFZqyMPHRGTv3eDdwvQsYgDATubZVURBdnwp2WhtwyxC2u6XnhQDaPEzZs99yn9vBpaHgZYyQ3whp1sfR'
    const rawtx =
      '010000000136c5a79de0dac41a7c1e9c4d5c833c7633ab540451443909a7d9f9bc758e60d8000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88acf07e0e00000000001976a9140fc863841cf1ec7fcadf8364c33c32187c87d9da88ac00000000'
    const expected = '2164fa1d4257a353140c8b219bf0aa711943eef3d013a7b5be38e40bea34ff94' // ( `0 - ${expected}` )

    // const path = '0/0/0'
    const abstrId = {
      role: Role.Provider,
      index: 0,
    }
    const result = signFor(masterPrivKeyForSign, 0)(abstrId, rawtx)

    expect(result).toBe(expected)
  })
})
