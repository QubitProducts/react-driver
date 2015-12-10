import 'colors'

export default function logger (namespace) {
  function log () {
    console.log(`${namespace}:`.cyan, ...arguments)
  }
  log.buffer = function buffer (data) {
    data.toString().split('\n').slice(0, -1).forEach(msg => log(msg))
  }
  return log
}
