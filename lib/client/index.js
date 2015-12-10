import methods from './methods'
import promise from 'when'

const APP_PROPERTY = '__REACTDRIVER_APPS__'
const API_PROPERTY = '__REACTDRIVER_API__'
const FIND_APP_TIMEOUT = 2000
const FIND_APP_INTERVAL = 2000

async function getApp (appName) {
  return promise(function (resolve, reject) {
    let intervalId = setInterval(findApp, FIND_APP_INTERVAL)
    let timerId = setTimeout(appNotFound, FIND_APP_TIMEOUT)

    function findApp () {
      if (window[APP_PROPERTY][appName]) {
        clearInterval(intervalId)
        clearTimeout(timerId)
        resolve()
      }
    }

    function appNotFound () {
      clearTimeout(intervalId)
      clearTimeout(timerId)
      reject()
    }
  })
}

async function call (appName, methodName, args, cb) {
  try {
    let app = await getApp(appName)
  } catch (e) {
    return cb(error(`App not found after ${FIND_APP_TIMEOUT}ms: ${appName}`))
  }

  if (!methods.hasOwnProperty[methodName]) {
    return cb(error(`Invalid method name: ${methodName}`))
  }

  let response = await methods[methodName](...args)
  cb(response)
}

window[API_PROPERTY] = { call }
