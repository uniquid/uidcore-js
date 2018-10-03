import { existsSync, mkdirSync, unlinkSync } from 'fs'
import * as path from 'path'
import { getNodeName, NAME_LENGTH, NODE_NAME_FILE } from './../../nodename'

describe('nodename', () => {
  let storedNodename: string
  const home = path.join(__dirname, 'home')
  beforeAll(() => {
    if (!existsSync(home)) {
      mkdirSync(home)
    }
    storedNodename = getNodeName({ home })
  })

  afterAll(() => {
    unlinkSync(path.join(home, NODE_NAME_FILE))
  })

  it(`name should be ${NAME_LENGTH} long`, () => {
    expect(storedNodename.length).toBe(NAME_LENGTH)
  })

  it('should retrieve stored name', () => {
    const nodename = getNodeName({ home })
    expect(nodename).toBe(storedNodename)
  })
})
