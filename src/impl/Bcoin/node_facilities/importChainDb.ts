import fs from 'fs'
import path from 'path'
import tar from 'tar-fs'
export const importDb = (_: {
  absoluteTarFileName: string
  absoluteNodeHomeDir: string
}) => fs.createReadStream(_.absoluteTarFileName).pipe(tar.extract(path.join(_.absoluteNodeHomeDir,'chain.db'))

