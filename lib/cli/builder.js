import webpack from 'webpack'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'
import MemoryFS from 'memory-fs'
import {call} from 'when/node'
import ProgressBar from 'progress'

const fs = new MemoryFS()

export default async function builder (config) {
  const webpackConfig = {
    context: __dirname + '/../client',
    entry: 'client.js',
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

  console.log('Building client bundle...')
  let compiler = webpack(webpackConfig)
  compiler.outputFileSystem = fs
  let stats = await call(::compiler.run)

  let jsonStats = stats.toJson()
  if (jsonStats.errors.length) {
    console.log(stats.toString({ colors: true }))
    throw new Error('Unable to build client bundle')
  } else {
    console.log('Client bundle built')
  }

  return fs.readFileSync('/build.js', 'utf8')
}
