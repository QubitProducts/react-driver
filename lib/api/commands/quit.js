import state from '../state'

export default async function quit () {
  let driver = state.get('driver')
  await driver.quit()
}
