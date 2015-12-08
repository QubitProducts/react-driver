import webpack from 'webpack'
import path from 'path'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'
import MemoryFS from 'memory-fs'
import {call} from 'when/node'
import ProgressBar from 'progress'
import logger from './logger'

const log = logger('builder')
const fs = new MemoryFS()

export default async function builder (config) {
  const webpackConfig = {
    context: path.resolve(__dirname + '/..'),
    entry: './client/client.js',
    output: {
      path: '/',
      filename: 'build.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({ warnings: false }),
      new webpack.optimize.OccurenceOrderPlugin(true)
    ],
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }]
    }
  }

  log('Building client bundle...')
  let compiler = webpack(webpackConfig)
  compiler.outputFileSystem = fs
  let stats = await call(::compiler.run)

  let jsonStats = stats.toJson()
  if (jsonStats.errors.length) {
    log(stats.toString({ colors: true }))
    throw new Error('Unable to build client bundle')
  } else {
    log('Client bundle built')
  }

  return fs.readFileSync('/build.js', 'utf8')
}
