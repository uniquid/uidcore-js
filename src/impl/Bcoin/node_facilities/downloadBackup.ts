import * as request from 'request'
// tslint:disable-next-line:no-require-imports
const progress = require('request-progress')
import * as cliProgress from 'cli-progress'
import { createWriteStream, unlink } from 'fs'
import { readFile } from 'fs'
import * as md5File from 'md5-file'
import { promisify } from 'util'

export default downloadBackup
export function downloadBackup(_: { blockNumber: number | void; network: string; host: string; saveAs?: string }) {
  const backupFilename = getBackupFilename(_)
  const baseFileUrl = `${_.host}/${backupFilename}`
  let baseSaveTo = _.saveAs || backupFilename.replace(/\//g, '_')
  if (!baseSaveTo.endsWith('.tgz')) {
    baseSaveTo = `${baseSaveTo}.tgz`
  }

  return dl(`${baseFileUrl}_md5`, `${baseSaveTo}_md5`).then(() => dl(baseFileUrl, `${baseSaveTo}`)).then(() =>
    checkBackupFileMD5({
      checksumFile: `${baseSaveTo}_md5`,
      backupFile: baseSaveTo
    })
  )
}

function dl(url: string, toFile: string) {
  console.log(`Downloading ${url}`)

  return new Promise<null>(function(resolve, reject) {
    const progressBar = new cliProgress.Bar({}, cliProgress.Presets.shades_classic)
    const dlReq = request(url)
    progress(dlReq)
      .on('response', function(response: any) {
        // tslint:disable-next-line:no-magic-numbers
        if (response.statusCode !== 200) {
          progressBar.stop()
          dlReq.abort()
          cleanupAndReject(response.statusCode)
        }
      })
      .on('request', function() {
        // tslint:disable-next-line:no-magic-numbers
        progressBar.start(100, 0)
      })
      .on('progress', function(state: any) {
        // tslint:disable-next-line:no-magic-numbers
        progressBar.update(Number((state.percent * 100).toFixed(5)))
      })
      .on('error', function(err: any) {
        progressBar.stop()
        cleanupAndReject(err)
      })
      .on('end', function() {
        // tslint:disable-next-line:no-magic-numbers
        progressBar.update(100)
        progressBar.stop()
        resolve(null)
      })
      .pipe(createWriteStream(toFile))

    function cleanupAndReject(err: any) {
      reject(err)
      // tslint:disable-next-line:no-empty
      unlink(toFile, () => {})
    }
  })
}
export function getBackupFilename({ blockNumber, network }: { blockNumber: number | void; network: string }) {
  let dbFileUrl: string
  if (!blockNumber) {
    dbFileUrl = `${network}_db_latest.tgz`
  } else {
    // tslint:disable-next-line:no-magic-numbers
    const paddedBlockNumber = `${blockNumber}`.padStart(9, '0')
    dbFileUrl = `${network}/db_${paddedBlockNumber}.tgz`
  }

  return dbFileUrl
}

export async function checkBackupFileMD5({ checksumFile, backupFile }: { checksumFile: string; backupFile: string }) {
  const [md5, hash] = await Promise.all([promisify(readFile)(checksumFile, 'utf8'), promisify(md5File)(backupFile)])

  if (md5.trim() !== hash.trim()) {
    throw new Error(`
MD5 checksum didn't match
    ${md5.trim()} : [${checksumFile}]
    ${hash.trim()} : [md5sum ${backupFile}]
`)
  }
}
