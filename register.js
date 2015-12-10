var APP_PROPERTY = '__REACTDRIVER_APPS__'

module.exports = function register (key, tree) {
  window[APP_PROPERTY] = window[APP_PROPERTY] || {}
  window[APP_PROPERTY][key] = tree
}
