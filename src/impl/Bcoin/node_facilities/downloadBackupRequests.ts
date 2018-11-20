import request from 'request'
export function downloadBackups({ blockNumber, network = 'testnet', host }: DownloadConfig) {
  const names = getBackupFilenames({
    blockNumber,
    network,
    host
  })

  return {
    db: request(names.dbFileUrl),
    md5: request(names.md5FileUrl)
  }
}
export function getBackupFilenames({ blockNumber, network = 'testnet', host }: FilenamesConfig) {
  let dbFileUrl: string
  let md5FileUrl: string
  if (blockNumber === false) {
    dbFileUrl = `${host}/${network}_db_latest.tgz`
    md5FileUrl = `${host}/${network}_checkpoints_latest`
  } else {
    // tslint:disable-next-line:no-magic-numbers
    const paddedBlockNumber = `${blockNumber}`.padStart(9, '0')
    dbFileUrl = `${host}/${network}/db_${paddedBlockNumber}.tgz`
    md5FileUrl = `${host}/${network}/checkpoints_${paddedBlockNumber}`
  }

  return {
    dbFileUrl,
    md5FileUrl
  }
}

export interface FilenamesConfig {
  blockNumber: number | false
  network: string
  host: string
}
export interface DownloadConfig extends FilenamesConfig {}
