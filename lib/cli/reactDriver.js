import {install, start, kill} from './standalone'
import builder from './builder'
import runner from './runner'
import logger from './logger'
import defaults from './defaults'

const log = logger('react-driver')

module.exports = async function reactDriver (config) {
  if (!config) {
    config = {}
    log(`Config file not found, using defaults`.bold.red)
  }

  config = { ...defaults, ...config }
  var kill
  if (config.standalone) {
    log('Using standalone selenium')
    await install()
    kill = await start(config.hostname, config.port)
  }

  config.buildFile = await builder()

  await runner(config)

  if (kill) {
    log('Shutting down standalone selenium')
    kill()
  }
}
