import webpack from 'webpack'
import path from 'path'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'
import {call} from 'when/node'
import ProgressBar from 'progress'
import logger from './logger'
import {mkdir, track} from 'temp'

const log = logger('builder')

track()

export default async function builder (config) {
  let outputDir = await call(mkdir, 'reactdriver')
  let bundleFile = path.join(outputDir, 'bundle.js')

  const webpackConfig = {
    context: path.resolve(__dirname + '/..'),
    entry: './client/index.js',
    output: {
      path: outputDir,
      filename: 'bundle.js'
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
  let stats = await call(webpack, webpackConfig)

  let jsonStats = stats.toJson()
  if (jsonStats.errors.length) {
    log(stats.toString({ colors: true }))
    throw new Error('Unable to build client bundle')
  } else {
    log(`Client bundle built at ${bundleFile}`)
  }

  return path.join(outputDir, 'bundle.js')
}
