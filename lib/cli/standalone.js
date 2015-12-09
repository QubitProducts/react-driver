import selenium from 'selenium-standalone'
import {call} from 'when/node'
import ProgressBar from 'progress'
import logger from './logger'

const log = logger('standalone')

export function install () {
  var bar
  const opts = {
    logger: log,
    progressCb
  }
  return call(selenium.install, opts)

  function progressCb (total, progress, chunk) {
    if (!bar) {
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

export async function start (port) {
  log('selenium-standalone starting')
  log('-----')

  let seleniumArgs = ['--port', port]
  let child = await call(selenium.start, { seleniumArgs })

  let kill = () => child.kill('SIGTERM')
  process.on('exit', kill)
  process.on('SIGTERM', kill)
  process.on('SIGINT', kill)

  return kill
}
