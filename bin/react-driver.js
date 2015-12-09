#!/usr/bin/env node

process.on('unhandledRejection', function (reason) {
  process.emit('SIGTERM')
  throw reason
})

var config
try {
  config = require(process.cwd() + '/react-driver.conf.js')
} catch (e) { }

require('babel-register')
require('babel-polyfill')

var reactDriver = require('../lib/cli/reactDriver')
reactDriver(config)
