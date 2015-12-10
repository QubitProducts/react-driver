import wd from 'wd'
import {readFile} from 'fs'
import {call} from 'when/node'
import assertLoaded from '../assertLoaded'
import state from '../state'

export default async function load (url, appName) {
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
