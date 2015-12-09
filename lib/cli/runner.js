import {unfold, promise} from 'when'
import {spawn} from 'child_process'
import {call} from 'when/node'
import spawnargs from 'spawn-args'
import logger from './logger'
import 'colors'

const log = logger('runner')

function makeKey (browser) {
  let keys = ['browserName', 'version', 'platform']
  var key = []
  keys.forEach(function (part) {
    if (browser.hasOwnProperty(part)) {
      key.push(browser[part])
    }
  })
  return key.join(':')
}

export default async function runner (config) {
  async function runBrowser (browser) {
    const key = makeKey(browser)
    const browserLog = logger('runner:' + key)

    let args = spawnargs(config.script)
    let command = args.shift()

    log(`Starting tests in ${key}`.bold.yellow)

    let browserConfig = {
      port: config.port,
      hostname: config.hostname,
      username: config.username,
      password: config.password,
      browser: browser
    }
    let env = {
      REACTDRIVER_CONFIG: JSON.stringify(browserConfig)
    }

    await promise(function (resolve) {
      let child = spawn(command, args, { env })
      child.stdout.on('data', browserLog.buffer)
      child.stderr.on('data', browserLog.buffer)
      child.on('error', (err) => log(err.message))
      child.on('close', function (code) {
        if (code !== 0) {
          failedBrowsers.push(browser)
          log(`Tests failed in ${key}`.bold.red)
        } else {
          log(`Tests passed in ${key}`.bold.green)
        }
        resolve()
      })
    })
  }

  let failedBrowsers = []
  let keys = config.browsers.map(makeKey)

  log(`Running tests on: `.bold.yellow + keys.join(', ').magenta)
  log('Using script: '.bold.yellow + config.script.magenta)

  await unfold(
    browsers => [browsers.shift(), browsers],
    browsers => browsers.length === 0,
    runBrowser,
    config.browsers.slice(0)
  )

  let totalBrowsers = config.browsers.length
  if (failedBrowsers.length > 0) {
    process.exitCode = 1
    log(`Tests failing in ${failedBrowsers.length}/${totalBrowsers} browsers`.bold.red)
  } else {
    log(`Tests passing in ${totalBrowsers}/${totalBrowsers} browsers`.bold.green)
  }
}
