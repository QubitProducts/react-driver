#!/usr/bin/env node

process.on('unhandledRejection', function (reason) {
  process.emit("SIGINT")
  throw reason
})

require('babel-register')
require('babel-polyfill')

var reactDriver = require('../lib/cli/reactDriver')
reactDriver({})
