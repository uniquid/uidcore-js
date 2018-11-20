// tslint:disable-next-line:no-require-imports
const compressing = require('compressing')
export function extractChainDBTarball(_: { tarballFile: string; extractTo: string }): Promise<void> {
  return compressing.tgz.uncompress(_.tarballFile, _.extractTo)
}
