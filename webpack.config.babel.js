import path from 'path'
import webpack from 'webpack'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

function absolute (...args) {
  return path.join(__dirname, ...args)
}

const fileName = 'bundle'
const debug = ['DEV', 'TEST'].includes(process.env.NODE_ENV)
const plugins = []
const rules = [{
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader'],
  }),
}, {
  test: /\.html/,
  loader: 'handlebars-loader',
}, {
  test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/,
  loader: 'url-loader?limit=8192',
}, {
  test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/,
  loader: 'url-loader?&name=asset/font/[name].[ext]',
}]

const externals = {
  lodash: '_', // {root: '_'},
  jquery: 'jQuery', // {root: ['$', 'jquery', 'jQuery']},
  d3: { root: 'd3' },
}

export default () => {
  if (!debug) {
    plugins.push(new UglifyJSPlugin({
      compress: {
        warnings: false,
      },
      mangle: {
        keep_fnames: true,
      },
    }))
  } else {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  plugins.push(new ExtractTextPlugin(`${fileName}.css`))

  return {
    entry: {
      libs: ['webcola', 'jquery.easing', 'eventemitter3'],
      bundle: ['webpack-hot-middleware/client', './client/app.js'],
    },
    output: {
      path: absolute(),
      publicPath: '/',
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js'],
    },
    devtool: 'source-map',
    // devServer: {
      // contentBase: './build',
      // hot: true,
      // watchOptions: { aggregateTimeout: 300, poll: 1000 },
    // },
    module: { rules },
    plugins,
    externals,
  }
}
