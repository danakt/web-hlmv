import { Configuration }      from 'webpack'
import * as path              from 'path'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

const config: Configuration = {
  devtool: 'source-map',
  entry:   './index.tsx',
  module:  {
    rules: [
      {
        test: /\.tsx?$/,
        use:  {
          loader:  'awesome-typescript-loader',
          options: {
            useBabel:     true,
            babelOptions: {
              babelrc: false,
              plugins: ['react-hot-loader/babel', 'babel-plugin-styled-components']
            },
            babelCore: '@babel/core'
          }
        },
        exclude: /node_modules/
      },

      // Model loading
      {
        test: /\.mdl$/,
        use:  'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path:     path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.html')
    })
  ]
}

export default config
