import {install, start, kill} from './standalone'
import builder from './builder'
import runner from './runner'

const defaults = {
  standalone: true,
  port: 4444,
  hostname: 'localhost',
  username: null,
  password: null,
  browsers: [{
    browserName: 'chrome'
  }]
}

module.exports = async function reactDriver (config) {
  config = { ...defaults, ...config }
  var kill
  if (config.standalone) {
    await install()
    kill = await start()
  }

  config.build = await builder()
  console.log(config.build)

  await runner(config)

  if (kill) {
    kill()
  }
}
