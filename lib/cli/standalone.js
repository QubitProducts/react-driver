import selenium from 'selenium-standalone'
import {call} from 'when/node'
import ProgressBar from 'progress'

const logger = ::console.log

export function install () {
  var bar
  const opts = {
    logger,
    progressCb
  }
  return call(selenium.install, opts)

  function progressCb (total, progress, chunk) {
    if (!bar) {
      logger()
      logger()
      bar = new ProgressBar(
        'selenium-standalone installation [:bar] :percent :etas', {
        total,
        complete: '=',
        incomplete: ' ',
        width: 20
      })
    }
    bar.tick(chunk)
  }
}

export async function start () {
  const opts = {
    spawnOptions: {
      stdio: 'inherit'
    },
    logger
  }

  let child = await call(selenium.start, opts)

  let kill = ::child.kill
  process.on('exit', kill)
  process.on('SIGTERM', kill)
  process.on('SIGINT', kill)

  return kill
}
