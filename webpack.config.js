const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = env => {
  const isProduction = !!env&&env.production
  const mode = isProduction?'production':'development'
  console.log('mode', mode, '\n')
  return {
    mode
    ,entry: './src/index.js'
    ,output: {
      path: path.resolve(__dirname, 'docs')
      ,filename: 'bundle.js'
    }
    ,devServer: {
      contentBase: path.resolve(__dirname, 'public')
      ,port: 7741
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/
          ,use: 'babel-loader'
          ,exclude: /node_modules/
        },{
          test: /\.css$/
          ,use: ['style-loader','css-loader']
        },{
          test: /\.(html|xml)/
          ,use: ['raw-loader']
        }
      ]
    }
    ,resolve: {
      extensions: [
        '.js'
        ,'.jsx'
        ,'.json'
        ,'.html'
      ]
    }
    ,plugins: [
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(require('./package.json').version)
        ,_VERSION: JSON.stringify(require('./package.json').version)
        ,_ENV: JSON.stringify(env||{})
      })
      ,new CopyWebpackPlugin({patterns:[
          {from: 'public', to: './'}
      ]})
    ]
  }
}








