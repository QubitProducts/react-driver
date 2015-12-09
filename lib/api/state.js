const state = {}

function set (key, value) {
  state[key] = value
}

function get (key) {
  return state[key]
}

export default { set, get }