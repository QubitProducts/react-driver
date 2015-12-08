import 'colors'

export default function logger (namespace) {
  function log () {
    console.log.apply(console, [`${namespace}:`.cyan, ...arguments])
  }
  log.buffer = function buffer (data) {
    data.toString().trim().split('\n').forEach(msg => log(msg))
  }
  return log
}
