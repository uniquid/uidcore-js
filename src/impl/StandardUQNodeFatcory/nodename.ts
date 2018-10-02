import * as crypto from 'crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'fs'
import * as path from 'path'
export const NAME_LENGTH = 12
export const generateUniqueName = (() => {
  const RND_BYTES_LENGTH = 6
  const HEX_BASE = 16
  const generate = (prefix = '') =>
    prefix +
    crypto
      .randomBytes(RND_BYTES_LENGTH)
      .readUIntBE(0, RND_BYTES_LENGTH)
      .toString(HEX_BASE)
      .padStart(NAME_LENGTH, '0')
      .toUpperCase()

  return generate
})()

export const NODE_NAME_FILE = 'node.name'

export interface Config {
  home: string
  prefix?: string
}
export const getNodeName = (config: Config) => {
  if (!existsSync(config.home)) {
    mkdirSync(config.home)
  }
  const nodenameFilePath = path.join(config.home, NODE_NAME_FILE)
  const exists = existsSync(nodenameFilePath)
  let nodename: string
  if (exists) {
    nodename = readFileSync(nodenameFilePath, 'UTF8')
  } else {
    nodename = generateUniqueName(config.prefix)
    writeFileSync(nodenameFilePath, nodename, { encoding: 'UTF8' })
  }

  return nodename
}
