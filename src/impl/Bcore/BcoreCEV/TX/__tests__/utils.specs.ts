import { formatTx, intArrayToRawTxString, parseTx, rawTxStringToIntArray } from './../parse'

const rawTX1 =
  '010000000136c5a79de0dac41a7c1e9c4d5c833c7633ab540451443909a7d9f9bc758e60d8000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88acf07e0e00000000001976a9140fc863841cf1ec7fcadf8364c33c32187c87d9da88ac00000000'
const rawTX2 =
  '01000000028a9799dcc44b529aa2c4ddf5e0a50550580f4ca51836cb43377d82f9a96914aa020000001976a91408af561bec99ea0dc427989b0945a2d0bdeb091888acffffffff8a9799dcc44b529aa2c4ddf5e0a50550580f4ca51836cb43377d82f9a96914aa000000001976a91408af561bec99ea0dc427989b0945a2d0bdeb091888acffffffff03580f0200000000001976a91408af561bec99ea0dc427989b0945a2d0bdeb091888ac0000000000000000536a4c5012bacc0000000000000000000000000000000000000000000000000000000000000000000000050607080000000000000000000000000000000000000000000000000000000000000000000000effe77a0b9ca26000000001976a91408af561bec99ea0dc427989b0945a2d0bdeb091888ac0000000001000000'

describe('Parsing and formatting TX', () => {
  it('parse format 1', () => {
    expect(intArrayToRawTxString(formatTx(parseTx(rawTxStringToIntArray(rawTX1))))).toBe(rawTX1)
  })
  it('parse format 2', () => {
    expect(intArrayToRawTxString(formatTx(parseTx(rawTxStringToIntArray(rawTX2))))).toBe(rawTX2)
  })
})