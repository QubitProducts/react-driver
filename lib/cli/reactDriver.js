import {install, start, kill} from './standalone'
import builder from './builder'
import runner from './runner'
import logger from './logger'

const log = logger('react-driver')

const defaults = {
  standalone: true,
  port: 4444,
  hostname: 'localhost',
  username: null,
  password: null,
  browsers: [{
    browserName: 'chrome'
  }, {
    browserName: 'firefox'
  }],
  command: 'exit 1'
}

module.exports = async function reactDriver (config) {
  config = { ...defaults, ...config }
  var kill
  if (config.standalone) {
    log('Using standalone selenium')
    await install()
    kill = await start()
  }

  config.build = await builder()

  await runner(config)

  if (kill) {
    log('Shutting down standalone selenium')
    kill()
  }
}
