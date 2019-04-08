import { readFile } from 'fs'
import * as md5File from 'md5-file'
import { promisify } from 'util'

export default checkBackupFileMD5
export async function checkBackupFileMD5({ checksumFile, backupFile }: { checksumFile: string; backupFile: string }) {
  const [md5, hash] = await Promise.all([
    promisify(readFile)(checksumFile, 'utf8'),
    promisify(md5File)(backupFile)
  ]).then(md5s => md5s.map(md5string => md5string.trim()))

  if (md5 !== hash) {
    return Promise.reject(`
MD5 checksum didn't match
    ${md5} : [${checksumFile}]
    ${hash} : [md5sum ${backupFile}]`)
  }

  return { checksumFile, backupFile }
}
