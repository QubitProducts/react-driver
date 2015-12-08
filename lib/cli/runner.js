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

    let args = spawnargs(config.command)
    let command = args.shift()

    log(`Starting tests in ${key}`.bold.yellow)

    await promise(function (resolve) {
      let child = spawn(command, args)
      child.stdout.on('data', browserLog.buffer)
      child.stderr.on('data', browserLog.buffer)
      child.on('error', (err) => log(err.message))
      child.on('close', function (code) {
        if (code !== 0) {
          failedBrowsers.push(browser)
          log(`Tests failed in ${key}`.bold.red)
        } else {
          log(`Tests complete in ${key}`.bold.green)
        }
        resolve()
      })
    })
  }

  let failedBrowsers = []
  let keys = config.browsers.map(makeKey)

  log(`Running tests on: `.bold.yellow + keys.join(', ').magenta)
  log('Using command: '.bold.yellow + config.command.magenta)

  await unfold(
    browsers => [browsers.shift(), browsers],
    browsers => browsers.length === 0,
    runBrowser,
    config.browsers
  )

  if (failedBrowsers.length > 0) {
    process.exitCode = 1
    log(`Tests failing in ${failedBrowsers.length}/${config.browsers.length} browsers`.bold.red)
  } else {
    log('Tests passing in all browsers'.bold.green)
  }
}
