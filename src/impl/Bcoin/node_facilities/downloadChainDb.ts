import download from 'download';
import fs from 'fs';
import path from 'path';
export interface Config {
  atBlock: number
  saveToAbsoluteDir: string
  renameTo?: string
  network?: string
}
export const importDb = ({
  atBlock,
  saveToAbsoluteDir,
  renameTo,
  network = 'testnet'
}: Config) => {

const dbFileName = `db_${atBlock}.tar`
renameTo = renameTo || dbFileName
const destinationFile = path.resolve(saveToAbsoluteDir, renameTo)
download(`http://35.180.120.244/${network}/${dbFileName}`).pipe(fs.createWriteStream(destinationFile));
}

