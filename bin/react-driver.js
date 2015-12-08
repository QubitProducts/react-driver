#!/usr/bin/env node

process.on('unhandledRejection', function (reason) {
  console.error('Unhandled Rejection: ', reason)
  process.exit('SIGTERM')
})

require('babel-register')
require('babel-polyfill')

var reactDriver = require('../lib/cli/reactDriver')
reactDriver({})
