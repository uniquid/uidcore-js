import { readFile } from 'fs'
import md5File from 'md5-file'
import { promisify } from 'util'

export interface Config {
  checksumFile: string
  backupFile: string
}
export async function checkBackupFileMD5({ checksumFile, backupFile }: Config) {
  const [md5, hash] = await Promise.all([promisify(readFile)(checksumFile, 'utf8'), promisify(md5File)(backupFile)])

  return md5 === hash
}
