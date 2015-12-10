import state from './state'
import wd from 'wd'
import {readFile} from 'fs'
import {call} from 'when/node'

if (!process.env.REACTDRIVER_CONFIG) {
  throw new Error('react-driver config not found in environment')
}
state.set('config', JSON.parse(process.env.REACTDRIVER_CONFIG))

function assertLoaded (checkDriver = true) {
  if (state.get('loading')) {
    throw new Error('Cannot perform operation whilst react-driver is loading')
  }
  if (!state.get('driver') && checkDriver) {
    throw new Error('Cannot perform operation with loading react-driver')
  }
}

export async function load (url, appName) {
  assertLoaded(false)

  state.set('loading', true)
  let driver = state.get('driver')

  if (!driver) {
    let { browser, ...config } = state.get('config')
    driver = wd.promiseRemote(config)
    state.set('driver', driver)
    await driver.init(browser)

    let bundle = await call(readFile, config.buildFile, 'utf8')
    await driver.execute(bundle)
  }

  await driver.get(url)
  state.set('loading', false)

  return driver
}

export async function quit () {
  let driver = state.get('driver')
  await driver.quit()
}

export async function select () {
  assertLoaded()
}

export async function action () {
  assertLoaded()
}
