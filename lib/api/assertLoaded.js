import state from './state'

export default function assertLoaded (checkDriver = true) {
  if (state.get('loading')) {
    throw new Error('Cannot perform operation whilst react-driver is loading')
  }
  if (!state.get('driver') && checkDriver) {
    throw new Error('Cannot perform operation with loading react-driver')
  }
}
