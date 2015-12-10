import state from './state'

if (!process.env.REACTDRIVER_CONFIG) {
  throw new Error('react-driver config not found in environment')
}
state.set('config', JSON.parse(process.env.REACTDRIVER_CONFIG))

export default {
  load: require('./commands/load'),
  quit: require('./commands/quit'),
  select: require('./commands/select')
}
