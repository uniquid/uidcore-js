/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import * as path from 'path'
import { makeBcoinID } from './../../../BcoinID'
import { transactionSigner } from './../sign'

describe('sign TX', () => {
  it('signs transaction', async () => {
    //  orchestration tank-c-1
    // {"sender":"mhtGWdgq2gnrNvaxFA2rXNAPypsv9ECfuc","body":{"method":30,"id":746339918,"params":"{\"tx\":\"010000000136c5a79de0dac41a7c1e9c4d5c833c7633ab540451443909a7d9f9bc758e60d8000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88acf07e0e00000000001976a9140fc863841cf1ec7fcadf8364c33c32187c87d9da88ac00000000\",\"paths\":[\"0/0/0\"]}"}}
    // {"sender":"mq2jvM52UirEKs14T9g9qoVH9C4rWnAzBX","body":{"result":"0 - 2164fa1d4257a353140c8b219bf0aa711943eef3d013a7b5be38e40bea34ff94","error":0,"id":746339918}}
    const unsignedRawTX =
      '010000000136c5a79de0dac41a7c1e9c4d5c833c7633ab540451443909a7d9f9bc758e60d8000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88acf07e0e00000000001976a9140fc863841cf1ec7fcadf8364c33c32187c87d9da88ac00000000'
    const expected = '2164fa1d4257a353140c8b219bf0aa711943eef3d013a7b5be38e40bea34ff94' // ( `0 - ${expected}` )
    const paths = ['0/0/0'].map(p => p.split('/'))
    const id = await makeBcoinID({
      home: path.join(__dirname, 'sign_home_test_1'),
      network: 'uqregtest'
    })
    const result = transactionSigner(id, unsignedRawTX, paths)
    expect(result.txid).toEqual(expected)
  })
  it('signs transaction', async () => {
    //  orchestration tank-c-100
    // {"sender":"mwoWz7maqFQgXU1Dk1oCGk7geeACpf6dcs","body":{"method":30,"id":1385577669,"params":"{\"tx\":\"0100000001eefaf2940cfcd15a8c18727a0f83ec44849318e329d62f3b84a6b186f72c0e3b000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914853711887a6279268212c2323e54c00d2c8f809688ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914853711887a6279268212c2323e54c00d2c8f809688acf07e0e00000000001976a9147638f2498957582602020dce44a6a8587be97f3988ac00000000\",\"paths\":[\"0/0/0\"]}"}}
    // {"sender":"mhZxrEYTvGxqq1ZyxN9euemErkBWA8jjGU","body":{"result":"0 - f45e14de75a77d2f825821d4b2078aca10f7dbf90ba1452d7f3fd7c3e2cdbc67","error":0,"id":1385577669}}
    const unsignedRawTX =
      '0100000001eefaf2940cfcd15a8c18727a0f83ec44849318e329d62f3b84a6b186f72c0e3b000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914853711887a6279268212c2323e54c00d2c8f809688ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914853711887a6279268212c2323e54c00d2c8f809688acf07e0e00000000001976a9147638f2498957582602020dce44a6a8587be97f3988ac00000000'
    const expected = 'f45e14de75a77d2f825821d4b2078aca10f7dbf90ba1452d7f3fd7c3e2cdbc67' // ( `0 - ${expected}` )
    const paths = ['0/0/0'].map(p => p.split('/'))
    const id = await makeBcoinID({
      home: path.join(__dirname, 'sign_home_test_2'),
      network: 'uqregtest'
    })
    const result = transactionSigner(id, unsignedRawTX, paths)
    expect(result.txid).toEqual(expected)
  })

  // TODO: splittare il codice di sign in sotto procedure: una può tornare la raw tx firmata per passare il seguente test
  // it('signs transaction', () => {
  //   // https://github.com/uniquid/uidcore-c/blob/master/tests.c#L476
  //   const unsignedRawTX =
  //     '010000000247a327c7f5d626a7159c5c0fccf90732ba733ab6e9eea53db24c4829b3cc46a40000000000ffffffffced72f216e191ebc3be3b7b8c5d8fc0a7ac52fa934e395f837a28f96df2d8f900100000000ffffffff0140420f00000000001976a91457c9afb8bc5e4fa738f5b46afcb51b43a48b270988ac00000000'
  //   const masterPrivKeyForSign =
  //     'tprv8ZgxMBicQKsPeUjbnmwN54rKdA1UCsoJsY3ngzhVxyqeTV5pPNo77heffPbSfWVy8vLkTcMwpQHTxJzjz8euKsdDzETM5WKyKFYNLxMAcmQ'
  //   const expected =
  //     '010000000247a327c7f5d626a7159c5c0fccf90732ba733ab6e9eea53db24c4829b3cc46a4000000006a473044022014fac39447707341f16cac6fcd9a7258dcc636767016e225c5bb2a2ed4462f4c02202867a07f0695109b47cd9de86d06393c9f3f1f0ebbde5f3f7914f5296edf1be4012102461fb3538ffec054fd4ee1e9087e7debf8442028f941bda308c24b508cbf69f7ffffffffced72f216e191ebc3be3b7b8c5d8fc0a7ac52fa934e395f837a28f96df2d8f90010000006a473044022061e3c20622dcbe8ea3a62c66ba56da91c4f1083b11bbd6e912df81bc92826ac50220631d302f309a1c5212933830f910ba2931ff32a5b41a2c9aaa808b926aa99363012102ece5ce70796b6893283aa0c8f30273c7dc0ff0b82a75017285387ecd2d767110ffffffff0140420f00000000001976a91457c9afb8bc5e4fa738f5b46afcb51b43a48b270988ac00000000' // ( `0 - ${expected}` )
  //   const paths = ['0/0/0', '0/0/1'].map(p => p.split('/'))
  //   const id = BcoinID({ privateKey: masterPrivKeyForSign })
  //   const result = sign(id)(unsignedRawTX, paths)
  //   expect(result).toEqual(expected)
  // })
})
