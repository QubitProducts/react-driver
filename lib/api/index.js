import state from './state'
import load from './commands/load'
import quit from './commands/quit'
import select from './commands/select'

if (!process.env.REACTDRIVER_CONFIG) {
  throw new Error('react-driver config not found in environment')
}
state.set('config', JSON.parse(process.env.REACTDRIVER_CONFIG))

export { load, quit, select }